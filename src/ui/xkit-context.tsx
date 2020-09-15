import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { XkitJs } from '@xkit-co/xkit.js'

const XkitContext = React.createContext<XkitJs | null>(null)

const { Provider, Consumer } = XkitContext

interface XkitProps {
  value: XkitJs
}

interface XkitState {
  xkit: XkitJs,
  unsubscribe?: Function,
}

// Wrap the Context Provider to provide custom listening behavior
// for the Xkit library
class XkitProvider extends React.Component<XkitProps, XkitState> {
  constructor (props: XkitProps) {
    super(props)
    this.state = { xkit: this.props.value }
  }

  componentDidMount (): void {
    const { value: xkit } = this.props
    if (!xkit) {
      console.error('Xkit was not passed to the React App, it will fail to load.')
    }
    const unsubscribe = xkit.onUpdate(() => {
      // need a fresh object to trigger the update with React context since it compares
      // object references
      this.setState({ xkit: Object.assign({}, xkit) })
    })
    this.setState({ unsubscribe })
  }

  componentWillUnmount (): void {
    const { unsubscribe } = this.state
    if (unsubscribe) {
      unsubscribe()
    }
  }

  render () {
    const { children } = this.props
    const { xkit } = this.state
    return (
      <XkitProvider value={xkit}>{children}</XkitProvider>
    )
  }
}

export {
  XkitProvider as Provider,
  Consumer
}
