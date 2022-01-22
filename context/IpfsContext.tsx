import { IPFSHTTPClient } from 'ipfs-http-client'
import React, { Dispatch, SetStateAction } from 'react'
import { IpfsContextParams } from '../types/app'

export const IpfsContext = React.createContext({
  ipfs: null,
  saveToIpfs: (ipfs: IPFSHTTPClient, file: File) => {}
} as IpfsContextParams)
