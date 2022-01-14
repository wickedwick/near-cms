import React, { useEffect } from 'react'
import Big from 'big.js'
import * as nearAPI from 'near-api-js'
import type { AppProps } from 'next/app'
import { UserRole } from '../assembly/main'
import { DbContext } from '../context/DbContext'
import { NearContext } from '../context/NearContext'
import { initContract } from '../services/contracts'
import { user } from '../services/db'
import { AppParams } from '../types/app'
import { NetworkConfiguration } from '../types/configuration'
import '../styles/globals.css'

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed()

function MyApp({ Component, pageProps }: AppProps) {
  const [contract, setContract] = React.useState<nearAPI.Contract | null>(null)
  const [currentUser, setCurrentUser] = React.useState<UserRole | undefined>(undefined)
  const [nearConfig, setNearConfig] = React.useState<NetworkConfiguration | null>(null)
  const [walletConnection, setWalletConnection] = React.useState<nearAPI.WalletConnection | null>(null)
  let db: any
  
  useEffect(() => {
    initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
      currentUser && contract.getUser({ username: currentUser.accountId }).then((user: UserRole) => {
        setCurrentUser(user)
      })
      setNearConfig(nearConfig)
      setWalletConnection(walletConnection)
      setContract(contract)
    })
  }, [])

  const initialState: AppParams = {
    contract,
    currentUser,
    nearConfig,
    wallet: walletConnection,
    setCurrentUser,
  }

  return (
    <NearContext.Provider value={initialState}>
      <DbContext.Provider value={{ db, user }}>
        <Component {...pageProps} />
      </DbContext.Provider>
    </NearContext.Provider>
  )
}

export default MyApp
