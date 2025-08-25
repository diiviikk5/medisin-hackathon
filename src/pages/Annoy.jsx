import React from 'react'
import { useAnnoyUser } from '../hooks/useAnnoyUser'

export function AnnoyProvider({ children }) {
  useAnnoyUser() // Initialize the annoyance system
  
  return <>{children}</>
}
