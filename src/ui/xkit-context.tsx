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
class SubscribedProvider extends React.Component<XkitProps, XkitState> {
  constructor (props: XkitProps) {
    super(props)
    this.state = { xkit: this.props.value }
  }

  componentDidMount (): void {
    this.subscribe()
  }

  subscribe (): void {
    const { value: xkit } = this.props
    const unsubscribe = xkit.onUpdate(() => {
      // need a fresh object to trigger the update with React context since it compares
      // object references
      this.setState({ xkit: Object.assign({}, xkit) })
    })
    this.setState({ unsubscribe })
  }

  unsubscribe (): void {
    const { unsubscribe } = this.state
    if (unsubscribe) {
      unsubscribe()
    }
  }

  componentDidUpdate (prevProps: XkitProps) {
    if (prevProps.value !== this.props.value) {
      this.unsubscribe()
      this.subscribe()
      this.setState({ xkit: this.props.value })
    }
  }

  componentWillUnmount (): void {
    this.unsubscribe()
  }

  render () {
    const { children } = this.props
    const { xkit } = this.state
    return (
      <Provider value={xkit}>
        {children}
      </Provider>
    )
  }
}

export {
  SubscribedProvider as Provider,
  Consumer
}
