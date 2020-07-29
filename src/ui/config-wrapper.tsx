import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  IKitConfig,
  AuthorizedConfig
} from '@xkit-co/xkit.js/lib/config'
import StateManager, { ConfigState, configGetter } from '@xkit-co/xkit.js/lib/config-state'

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export type ConfigConsumer<T = {}> = T & {
  config: AuthorizedConfig,
  callWithConfig: configGetter,
  configLoading: boolean
}

let stateManager: StateManager
 
export function withConfig<Props extends {}>(WrappedComponent: React.ComponentType<Props>): React.ComponentType<Omit<Props, keyof ConfigConsumer>> {
  class WithConfig extends React.Component<Omit<Props, keyof ConfigConsumer>, ConfigState> {
    static displayName: string

    constructor (props: Props) {
      super(props)
      if (!stateManager) {
        throw new Error('Cannot use the "withConfig" Higher-order component without first mounting the "ConfigWrapper"')
      }
      this.state = stateManager.getState()
    }

    handleStateUpdate = (state: ConfigState): void => {
      this.setState(stateManager.getState())
    }

    componentDidMount (): void {
      this.setState(stateManager.getState())
      stateManager.emitter.on('update', this.handleStateUpdate)
    }

    componentWillUnmount (): void {
      stateManager.emitter.off('update', this.handleStateUpdate)
    }

    render (): React.ReactElement {
      const {
        token,
        domain,
        loading
      } = this.state

      return (
        <WrappedComponent
          config={{ token, domain } as AuthorizedConfig}
          configLoading={loading}
          callWithConfig={stateManager.callWithConfig}
          {...this.props as Props}
        />
      )
    }
  }

  WithConfig.displayName = `WithConfig(${getDisplayName(WrappedComponent)})`

  return WithConfig
}

interface ConfigWrapperProps extends IKitConfig {
  loginRedirect: string
}

export class ConfigWrapper extends React.Component<ConfigWrapperProps, ConfigState> {
  constructor (props: ConfigWrapperProps) {
    super(props)
    if (!stateManager) {
      stateManager = new StateManager({
        domain: this.props.domain,
        loginRedirect: this.props.loginRedirect
      })
    }
    stateManager.setState({
      domain: this.props.domain,
      loginRedirect: this.props.loginRedirect
    })
    this.state = stateManager.getState()
  }

  handleStateUpdate = (state: ConfigState): void => {
    this.setState(stateManager.getState())
  }

  componentDidMount (): void {
    this.setState(stateManager.getState())
    stateManager.emitter.on('update', this.handleStateUpdate)
  }

  componentWillUnmount (): void {
    stateManager.emitter.off('update', this.handleStateUpdate)
  }

  render (): React.ReactNode {
    return this.props.children
  }
}
