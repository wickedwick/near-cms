import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import Big from 'big.js'
import { AppParams } from '../types/app'
window.React = React

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed()

const App = ({ contract, currentUser, nearConfig, wallet }: AppParams) => {
  const [contentTypes, setContentTypes] = useState([])

  useEffect(() => {
    contract.getContentTypes().then(setContentTypes)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    const { fieldset, fields, name } = e.target.elements

    fieldset.disabled = true
    const contentType = {
      name: name.value,
      fields: fields.value.split(',').map((field) => field.trim()),
    }

    contract.setContentType(
      { contentType },
      BOATLOAD_OF_GAS,
      Big('0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getContentTypes().then(setContentTypes)
    })
  }

  const signIn = () => {
    wallet.requestSignIn(
      {contractId: nearConfig.contractName, methodNames: [contract.setContentType.name]}, //contract requesting access
      'NEAR CMS', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    )
  }

  const signOut = () => {
    wallet.signOut()
    window.location.replace(window.location.origin + window.location.pathname)
  }

  return (
    <main>
      <header>
        <h1>dCMS</h1>
        {currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      {currentUser &&
        <p>{currentUser.accountId}</p>
      }
      { !!currentUser && !!contentTypes.length && <p>Not logged in</p> }
    </main>
  )
}

export default App
