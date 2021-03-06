import { IPFS } from "ipfs-core"
import * as nearAPI from 'near-api-js';
import { UserRole } from '../assembly/main';
import { NetworkConfiguration } from './configuration';
import { CmsContract } from "./contract";

export type AppParams = {
  contract: CmsContract | null
  currentUser: UserRole | undefined
  nearConfig: NetworkConfiguration | null
  wallet: nearAPI.WalletConnection | null
  setCurrentUser: (user: UserRole | undefined) => void
}

export type DbContextParams = {
  db: any | null
  user: any | null
}

export type LayoutProps = {
  children: React.ReactNode
  home: boolean
}

export type IpfsContextParams = {
  ipfs: any | null
  saveToIpfs: (ipfs: IPFS, file: File) => Promise<string>
  removeFromIpfs: (ipfs: IPFS, cid: string) => Promise<boolean>
}

export type Receipt = {
  kind: number
  signerId: string
  data: string
  functionName: string
  timestamp: number
}

export enum ActionKind {
  CREATE_ACCOUNT = 0,
  DEPLOY_CONTRACT = 1,
  FUNCTION_CALL = 2,
  TRANSFER = 3,
  STAKE = 4,
  ADD_KEY = 5,
  DELETE_KEY = 6,
  DELETE_ACCOUNT = 7,
}
