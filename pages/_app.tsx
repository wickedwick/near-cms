import '../styles/globals.css'
import type { AppProps } from 'next/app'
import getConfig from '../config'
import * as nearAPI from 'near-api-js'
import { useEffect } from 'react'
import React from 'react'
import { AppParams, User } from '../types/app'
import { NetworkConfiguration } from '../types/configuration'
import Big from 'big.js'
import { NearContext } from '../context/NearContext'

async function initContract() {
  const nearConfig = getConfig('testnet')
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
  const near = await nearAPI.connect({ keyStore, ...nearConfig })
  const walletConnection = new nearAPI.WalletConnection(near, '')
  let currentUser

  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    } as User
  }

  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ['getContentType', 'getContentTypes', 'getContents', 'getContent', 'getUserRole'],
      changeMethods: ['setContentType', 'deleteContentType', 'setContent', 'deleteContent', 'setUserRole', 'deleteUserRole'],
      sender: walletConnection.getAccountId(),
    }
  )

  return { contract, currentUser, nearConfig, walletConnection }
}

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed()

function MyApp({ Component, pageProps }: AppProps) {
  const [contract, setContract] = React.useState<nearAPI.Contract | null>(null)
  const [currentUser, setCurrentUser] = React.useState<User | undefined>(undefined)
  const [nearConfig, setNearConfig] = React.useState<NetworkConfiguration | null>(null)
  const [walletConnection, setWalletConnection] = React.useState<nearAPI.WalletConnection | null>(null)

  useEffect(() => {
    initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
      setNearConfig(nearConfig)
      setWalletConnection(walletConnection)
      setContract(contract)
      setCurrentUser(currentUser)
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
      <Component {...pageProps} />
    </NearContext.Provider>
  )
}

export default MyApp
