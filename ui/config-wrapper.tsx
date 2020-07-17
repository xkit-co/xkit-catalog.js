import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  IKitConfig,
  AuthorizedConfig
} from '@xkit-co/xkit.js/lib/config'
import { Redirect } from 'react-router-dom'
import {
  login,
  getAccessToken
} from '@xkit-co/xkit.js/lib/api/session'
import {
  getPlatform
} from '@xkit-co/xkit.js/lib/api/platform'
import { toaster } from './toaster'

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export type ConfigConsumer<T = {}> = T & {
  config: AuthorizedConfig,
  configLoading: boolean
}

interface ConfigWrapperState {
  domain?: string,
  token?: string,
  loading: boolean,
  loginRedirect?: string
}

let state: ConfigWrapperState = {
  loading: true
}
const listeners: React.Component[] = []

function setState(newState: Partial<ConfigWrapperState>): void {
  state = Object.assign(state, newState)
  listeners.forEach(c => c.setState(getState()))
}

function getState(): ConfigWrapperState {
  return Object.assign({}, state)
}

export async function callWithConfig<T>(fn: (config: AuthorizedConfig) => Promise<T>): Promise<T> {
  const {
    token,
    domain,
    loginRedirect
  } = getState()

  try {
    const res = await fn({ domain, token })
    return res
  } catch (e) {
    if (e.statusCode === 401) {
      try {
        const newToken = await getAccessToken({ domain })
        setState({ token: newToken })
      } catch (e) {
        console.error(`Encoutered error while refreshing access: ${e.message}`)
        if (!loginRedirect) {
          console.error('Misconfigured site: unable to retrieve login redirect location')
          // TODO: record this ourselves
          toaster.danger('We encountered an unexpected error. Please report this issue.')
          return
        }
        window.location.href = loginRedirect
        return
      }

      const newState = getState()

      const res = await fn({ domain: newState.domain, token: newState.token })
      return res
    }
    throw e
  }
}
 
export function withConfig<Props extends {}>(WrappedComponent: React.ComponentType<Props>): React.ComponentType<Omit<Props, keyof ConfigConsumer>> {
  class WithConfig extends React.Component<Omit<Props, keyof ConfigConsumer>, ConfigWrapperState> {
    static displayName: string

    constructor (props: Props) {
      super(props)
      this.state = getState()
    }

    componentDidMount (): void {
      this.setState(getState())
      listeners.push(this)
    }

    componentWillUnmount (): void {
      const selfIndex = listeners.findIndex(c => c === this)
      if (selfIndex !== -1) {
        listeners.splice(selfIndex, 1)
      }
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

export class ConfigWrapper extends React.Component<ConfigWrapperProps, ConfigWrapperState> {
  constructor (props: ConfigWrapperProps) {
    super(props)
    setState({
      domain: this.props.domain,
      loginRedirect: this.props.loginRedirect
    })
    this.state = getState()
  }

  componentDidMount (): void {
    this.setState(getState())
    listeners.push(this)
    this.initializeConfig()
  }

  componentWillUnmount (): void {
    const selfIndex = listeners.findIndex(c => c === this)
    if (selfIndex !== -1) {
      listeners.splice(selfIndex, 1)
    }
  }

  componentDidUpdate (prevProps: ConfigWrapperProps): void {
    if (prevProps.domain !== this.props.domain) {
      setState({ domain: this.props.domain })
      this.initializeConfig()
    } else if (prevProps.token !== this.props.token) {
      this.initializeConfig()
    }
  }

  async initializeConfig (): Promise<void> {
    await this.loadLoginRedirect()
    if (this.props.token) {
      this.login()
    } else {
      this.loadToken()
    }
  }

  async login (): Promise<void> {
    const { domain, token } = this.props
    setState({
      loading: true
    })
    try {
      await login({ domain }, token)
      setState({ token })
    } catch (e) {
      if (e.statusCode === 401) {
        // token is expired, throw it away and
        // try to refresh
        await this.loadToken()
      } else {
        console.warn(e)
      }
    } finally {
      setState({ loading: false })
    }
  }

  async loadToken (): Promise<void> {
    const { domain } = this.props
    setState({
      loading: true
    })
    try {
      const token = await getAccessToken({ domain })
      setState({ token })
    } catch (e) {
      console.warn(e)
    } finally {
      setState({ loading: false })
    }
  }

  async loadLoginRedirect (): Promise<void> {
    if (this.state.loginRedirect) {
      return
    }
    const { domain } = this.props
    try {
      const { login_redirect_url } = await getPlatform({ domain })
      setState({ loginRedirect: login_redirect_url })
    } catch (e) {
      console.error(e)
    }
  }

  render (): React.ReactNode {
    return this.props.children
  }
}
