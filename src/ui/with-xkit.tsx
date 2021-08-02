import * as React from 'react'
import { XkitJs } from '@xkit-co/xkit.js'
import { Consumer } from './xkit-context'

function getDisplayName(WrappedComponent: React.ComponentType): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export type XkitConsumer<T = {}> = T & {
  xkit: XkitJs
}

export default function withXkit<Props extends {}>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof XkitConsumer>> {
  class WithXkit extends React.Component<Omit<Props, keyof XkitConsumer>, {}> {
    static displayName: string

    render(): React.ReactElement {
      return (
        <Consumer>
          {(xkit) => (
            <WrappedComponent xkit={xkit} {...(this.props as Props)} />
          )}
        </Consumer>
      )
    }
  }

  WithXkit.displayName = `WithXkit(${getDisplayName(WrappedComponent)})`

  return WithXkit
}
