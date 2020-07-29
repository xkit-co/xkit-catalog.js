import * as React from 'react'
import {
  toaster as defaultToaster
} from 'evergreen-ui'
// TODO: allow customization / BYOToaster

interface ToasterSettings {
  description?: React.ReactNode
  duration?: number
  id?: string
  hasCloseButton?: boolean
}

const toaster: typeof defaultToaster = {
  ...defaultToaster,
  danger: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.error(title)
    }
    defaultToaster.danger(title, settings)
  },
  warning: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.warn(title)
    }
    defaultToaster.warning(title, settings)
  }
}

export { toaster }
