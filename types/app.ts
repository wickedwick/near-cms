import * as nearAPI from 'near-api-js';
import { NetworkConfiguration } from './configuration';

export type AppParams = {
  contract: nearAPI.Contract | null
  currentUser: User | undefined
  nearConfig: NetworkConfiguration | null
  wallet: nearAPI.WalletConnection | null,
  setCurrentUser: (user: User | undefined) => void
}

export type User = {
  accountId: string
  balance: string
}