import React, { useEffect, useState } from 'react'
import Big from 'big.js'
import { IPFS } from 'ipfs-core'
import * as nearAPI from 'near-api-js'
import type { AppProps } from 'next/app'
import { UserRole } from '../assembly/main'
import { DbContext } from '../context/DbContext'
import { IpfsContext } from '../context/IpfsContext'
import { NearContext } from '../context/NearContext'
import { initContract } from '../services/contracts'
import { instantiateIpfs, saveToIpfs } from '../services/ipfs'
import { db, user } from '../services/db'
import { AppParams } from '../types/app'
import { NetworkConfiguration } from '../types/configuration'

import '../styles/globals.css'

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed()

function MyApp({ Component, pageProps }: AppProps) {
  const [contract, setContract] = useState<nearAPI.Contract | null>(null)
  const [currentUser, setCurrentUser] = useState<UserRole | undefined>(undefined)
  const [nearConfig, setNearConfig] = useState<NetworkConfiguration | null>(null)
  const [walletConnection, setWalletConnection] = useState<nearAPI.WalletConnection | null>(null)
  const [ipfs, setIpfs] = useState<IPFS | null>(null)  

  useEffect(() => {
    initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
      currentUser && contract.getUser({ username: currentUser.accountId }).then((user: UserRole) => {
        setCurrentUser(user)
      })
      setNearConfig(nearConfig)
      setWalletConnection(walletConnection)
      setContract(contract)
      
      if (ipfs) return

      instantiateIpfs(setIpfs)
    })
  }, [ipfs])

  const initialState: AppParams = {
    contract,
    currentUser,
    nearConfig,
    wallet: walletConnection,
    setCurrentUser,
  }

  const ipfsState = {
    ipfs,
    saveToIpfs
  }

  return (
    <NearContext.Provider value={initialState}>
      <DbContext.Provider value={{ db, user }}>
        <IpfsContext.Provider value={ipfsState}>
          <Component {...pageProps} />
        </IpfsContext.Provider>
      </DbContext.Provider>
    </NearContext.Provider>
  )
}

export default MyApp
