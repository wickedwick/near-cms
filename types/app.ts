import * as nearAPI from 'near-api-js';
import { NetworkConfiguration } from './configuration';

export type AppParams = {
  contract: nearAPI.Contract
  currentUser: User
  nearConfig: NetworkConfiguration
  wallet: nearAPI.WalletConnection
}

export type User = {
  accountId: string
  balance: string
}