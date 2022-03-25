import React, { useEffect, useState } from 'react'
import { IPFS } from 'ipfs-core'
import * as nearAPI from 'near-api-js'
import type { AppProps } from 'next/app'
import { UserRole } from '../assembly/main'
import { DbContext } from '../context/DbContext'
import { IpfsContext } from '../context/IpfsContext'
import { NearContext } from '../context/NearContext'
import { initContract } from '../services/contracts'
import { instantiateIpfs, saveToIpfs, removeFromIpfs } from '../services/ipfs'
import { db, user } from '../services/db'
import { AppParams } from '../types/app'
import { NetworkConfiguration } from '../types/configuration'

import '../styles/globals.css'
import { CmsContract } from '../types/contract'
import { Role } from '../assembly/model'

function MyApp({ Component, pageProps }: AppProps) {
  const [cmsContract, setContract] = useState<CmsContract | null>(null)
  const [currentUser, setCurrentUser] = useState<UserRole | undefined>(undefined)
  const [nearConfig, setNearConfig] = useState<NetworkConfiguration | null>(null)
  const [walletConnection, setWalletConnection] = useState<nearAPI.WalletConnection | null>(null)
  const [ipfs, setIpfs] = useState<IPFS | null>(null)  

  const setDefaultUser = (accountId: string) => {
    const userRole: UserRole = {
      username: accountId,
      role: Role.Public,
    }

    setCurrentUser(userRole)
  }

  useEffect(() => {
    initContract().then(({ contract, currentUser, nearConfig, walletConnection }) => {
      setNearConfig(nearConfig)
      setWalletConnection(walletConnection)
      setContract(contract as CmsContract)
      
      currentUser && cmsContract && (
        cmsContract.getUser({ username: currentUser.accountId })
          .then((user: UserRole) => {
            if (!user) {
              setDefaultUser(currentUser.accountId)
            } else {
              setCurrentUser(user)
            }
          })
      )
      
      if (ipfs) return

      instantiateIpfs(setIpfs)
    })
  }, [ipfs])

  const initialState: AppParams = {
    contract: cmsContract,
    currentUser,
    nearConfig,
    wallet: walletConnection,
    setCurrentUser,
  }

  const ipfsState = {
    ipfs,
    saveToIpfs,
    removeFromIpfs
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
