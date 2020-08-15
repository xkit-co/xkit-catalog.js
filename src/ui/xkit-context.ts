import * as React from 'react'
import { XkitJs } from '@xkit-co/xkit.js'

const XkitContext = React.createContext<XkitJs | null>(null)

export default XkitContext
const { Provider, Consumer } = XkitContext
export { Provider, Consumer }
