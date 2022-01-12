import React from 'react'
import { DbContextParams } from '../types/app'

export const DbContext = React.createContext({
  db: null,
  user: null
} as DbContextParams)