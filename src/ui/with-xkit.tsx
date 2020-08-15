import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { XkitJs } from '@xkit-co/xkit.js'
import { Consumer } from './xkit-context'

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export type XkitConsumer<T = {}> = T & {
  xkit: XkitJs
}

let xkit: XkitJs
 
export default function withXkit<Props extends {}>(WrappedComponent: React.ComponentType<Props>): React.ComponentType<Omit<Props, keyof XkitConsumer>> {
  class WithXkit extends React.Component<Omit<Props, keyof XkitConsumer>, {}> {
    static displayName: string

    constructor (props: Props) {
      super(props)
    }

    render (): React.ReactElement {
      return (
        <Consumer>
          {xkit => <WrappedComponent xkit={xkit} {...this.props as Props} />}
        </Consumer>
      )
    }
  }

  WithXkit.displayName = `WithXkit(${getDisplayName(WrappedComponent)})`

  return WithXkit
}
