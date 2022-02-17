import { IPFS } from 'ipfs-core'
import React from 'react'
import { IpfsContextParams } from '../types/app'

export const IpfsContext = React.createContext({
  ipfs: null,
  saveToIpfs: (ipfs: IPFS, file: File) => {},
  removeFromIpfs: (ipfs: IPFS, cid: string) => {},
} as IpfsContextParams)
