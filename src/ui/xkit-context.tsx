import * as React from 'react'
import { XkitJs } from '@xkit-co/xkit.js'

const XkitContext = React.createContext<XkitJs | null>(null)

const { Provider, Consumer } = XkitContext

interface XkitProps {
  value: XkitJs
}

interface XkitState {
  xkit: XkitJs
}

// Wrap the Context Provider to provide custom listening behavior
// for the Xkit library
class SubscribedProvider extends React.Component<XkitProps, XkitState> {
  constructor(props: XkitProps) {
    super(props)
    this.state = { xkit: this.props.value }
  }

  componentDidMount(): void {
    this.subscribe()
  }

  onConfigUpdate = (): void => {
    const { value: xkit } = this.props
    // need a fresh object to trigger the update with React context since it compares
    // object references
    this.setState({ xkit: Object.assign({}, xkit) })
  }

  subscribe(): void {
    const { value: xkit } = this.props
    xkit.on('config:update', this.onConfigUpdate)
  }

  unsubscribe(): void {
    const { value: xkit } = this.props
    try {
      xkit.off('config:update', this.onConfigUpdate)
    } catch {}
  }

  componentDidUpdate(prevProps: XkitProps): void {
    if (prevProps.value !== this.props.value) {
      this.unsubscribe()
      this.subscribe()
      this.setState({ xkit: this.props.value })
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe()
  }

  render(): React.ReactElement {
    const { children } = this.props
    const { xkit } = this.state
    return <Provider value={xkit}>{children}</Provider>
  }
}

function useXkit(): XkitJs {
  return React.useContext(XkitContext)
}

export { SubscribedProvider as Provider, Consumer, useXkit }
