import * as React from 'react'
import { XkitJs } from '@xkit-co/xkit.js'

const XkitContext = React.createContext<XkitJs | undefined>()

export default XkitContext
export XkitContext.Provider as Provider
export XkitContext.Consumer as Consumer
