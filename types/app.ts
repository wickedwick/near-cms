import * as nearAPI from 'near-api-js';
import { UserRole } from '../assembly/main';
import { NetworkConfiguration } from './configuration';

export type AppParams = {
  contract: nearAPI.Contract | null
  currentUser: UserRole | undefined
  nearConfig: NetworkConfiguration | null
  wallet: nearAPI.WalletConnection | null,
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
