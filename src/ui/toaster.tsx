import * as React from 'react'
import { toaster as defaultToaster } from '@treygriffith/evergreen-ui'
import RehomeEvergreen from './rehome-evergreen'
import { logger } from '../util'
// TODO: allow customization / BYOToaster

interface ToasterSettings {
  description?: React.ReactNode
  duration?: number
  id?: string
  hasCloseButton?: boolean
}

// TODO: use a context rather than importing the toaster from this file.
// May help us enforce the one-Toaster-per-app rule
export const toaster: typeof defaultToaster = {
  ...defaultToaster,
  danger: (title: string, settings?: ToasterSettings): void => {
    if (process.env.NODE_ENV === 'development') {
      logger.error(title)
    }
    defaultToaster.danger(title, settings)
  },
  warning: (title: string, settings?: ToasterSettings): void => {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(title)
    }
    defaultToaster.warning(title, settings)
  }
}

export const Toaster: React.FC = ({ children }) => {
  return (
    <RehomeEvergreen components='data-xkit-toaster-container'>
      {children}
    </RehomeEvergreen>
  )
}
