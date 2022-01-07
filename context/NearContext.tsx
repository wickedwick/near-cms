import React from 'react'
import { AppParams } from '../types/app'

export const NearContext = React.createContext({
  contract: null,
  currentUser: undefined,
  nearConfig: null,
  wallet: null,
} as AppParams)

