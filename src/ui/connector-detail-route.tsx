import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IKitConfig } from '@xkit-co/xkit.js/lib/config'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import {
  Connection,
  isConnection
} from '@xkit-co/xkit.js/lib/api/connection'
import { hasOwnProperty } from '@xkit-co/xkit.js/lib/util'
import { toaster } from './toaster'
import {
  Pane,
  Spinner,
  majorScale
} from '@treygriffith/evergreen-ui'
import withXkit, { XkitConsumer } from './with-xkit'
import {
  Redirect,
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import Settings, { SettingsField } from './settings'
import Install from './install'

export type SettingsUpdate = (connection: Connection, fields?: SettingsField[]) => SettingsField[] | Promise<SettingsField[]>

interface ConnectorDetailRouteProps {
  updateSettings?: SettingsUpdate,
  removeBranding: boolean,
  slug: string,
  url: string,
  path: string
}

interface ConnectorDetailRouteState {
  connector?: Connector,
  connection?: Connection,
  settings?: SettingsField[]
  loading: boolean
}

class ConnectorDetailRoute extends React.Component<XkitConsumer<RouteComponentProps<ConnectorDetailRouteProps>>, ConnectorDetailRouteState> {
  constructor (props: XkitConsumer<ConnectorDetailRouteProps>) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    this.loadConnector()
  }

  componentDidUpdate (prevProps: XkitConsumer<ConnectorDetailRouteProps>) {
    if (prevProps.xkit !== this.props.xkit) {
      this.loadConnector()
    }
  }

  async loadConnector (): Promise<void> {
    const {
      slug,
      xkit,
      updateSettings
    } = this.props
    this.setState({ loading: true })
    try {
      const connection = await xkit.getConnectionOrConnector(slug)
      if (isConnection(connection)) {
        await this.updateConnection(connection)
      }
      this.setState({ connector: connection.connector })
    } catch (e) {
      toaster.danger(`Error while loading connector: ${e.message}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  async updateConnection (connection?: Connection): Promise<void> {
    this.setState({ connection })
    if (!this.props.updateSettings || !connection) return
    try {
      const settings = await this.props.updateSettings(connection)
      this.setState({ settings })
    } catch (e) {
      toaster.danger(`Error while loading settings: ${e.message}`)
    }
  }

  async updateSettings (connection: Connection, settingsToSave: SettingsField[]): Promise<SettingsField[]> {
    const { connector } = this.state
    const {
      updateSettings,
      history,
      url
    } = this.props
    const settings = await updateSettings(connection, settingsToSave)
    this.setState({ settings })
    history.push(url)
    return settings
  }

  handleInstall = async (connection: Connection): Promise<void> => {
    const { history, url } = this.props
    await this.updateConnection(connection)
    history.push(`${url}/settings`)
  }

  render (): React.ReactElement {
    const {
      removeBranding,
      updateSettings,
      path,
      url,
      slug
    } = this.props
    const {
      loading,
      connector,
      connection,
      settings
    } = this.state
    if (loading) {
      return (
        <Pane display="flex" alignItems="center" justifyContent="center" height={150}>
          <Spinner size={majorScale(6)} />
        </Pane>
      )
    }

    if (!connector) {
      const parentUrl = url.slice(0, -1 * slug.length)
      return <Redirect to={parentUrl} />
    }

    const showSettings = connection && connection.enabled && settings && settings.length > 0

    return (
      <Switch>
        {showSettings && (
          <Route path={`${path}/settings`}>
            <Settings
              removeBranding={removeBranding}
              connection={connection}
              connector={connector}
              updateConnection={c => this.updateConnection(c)}
              fields={settings}
              onUpdate={fields => this.updateSettings(connection, fields)}
              url={url}
            />
          </Route>
        )}
        <Route>
          <Install
            removeBranding={removeBranding}
            connection={connection}
            connector={connector}
            onInstall={this.handleInstall}
            onRemove={() => this.updateConnection(undefined)}
            showSettings={showSettings}
            url={url}
          />
        </Route>
      </Switch>
    )
  }
}

export default withXkit(withRouter(ConnectorDetailRoute))
