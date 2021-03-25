import React, { useEffect, useState } from 'react'
import {
  Redirect,
  Switch,
  Route,
  withRouter,
  RouteComponentProps,
  Link
} from 'react-router-dom'
import { XkitJs } from '@xkit-co/xkit.js'
import {
  Connection,
  ConnectionStatus,
  connectionStatus,
  isConnection
} from '@xkit-co/xkit.js/lib/api/connection'
import { toaster } from './toaster'
import {
  Pane,
  Spinner,
  majorScale,
  BackButton,
} from '@treygriffith/evergreen-ui'
import withXkit, { XkitConsumer } from './with-xkit'
import { friendlyMessage } from './errors'
import { SettingsUpdate } from './app'
import { SettingsField } from './settings-form'
import ConnectorInstallation from './connector-installation'
import ConnectorSettings from './connector-settings'
import PoweredBy from './powered-by'
import ConnectorAuthAlert from './connector-auth-alert'

interface ConnectorDetailsBaseProps {
  path: string,
  url: string,
  slug: string,
  removeBranding: boolean,
  settingsUpdate: SettingsUpdate
}

type ConnectorDetailsProps = RouteComponentProps & XkitConsumer<ConnectorDetailsBaseProps>

const ConnectorDetails: React.FC<ConnectorDetailsProps> = ({
  path,
  slug,
  removeBranding,
  settingsUpdate,
  history,
  url,
  xkit
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [actionPending, setActionPending] = useState(false)
  const [connector, setConnector] = useState(null)
  const [connection, setConnection] = useState(null)
  const [fields, setFields] = useState(undefined)

  async function loadData(xkit: XkitJs, slug: string) {
    setIsLoading(true)
    try {
      const connection = await xkit.getConnectionOrConnector(slug)
      if (isConnection(connection)) {
        setConnection(connection)
        await loadSettings(connection)
      }
      setConnector(connection.connector)
    } catch (e) {
      toaster.danger(`Error while loading connector: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadSettings(connection: Connection) {
    if (!settingsUpdate || !connection) return
    try {
      setFields(await settingsUpdate(connection, fields))
    } catch (e) {
      toaster.danger(`Error while loading settings: ${e.message}`)
    }
  }

  async function installConnector() {
    try {
      setActionPending(true)
      const connection = await xkit.connect(connector)
      setConnection(connection)
      await loadSettings(connection)
      history.push(`${url}/settings`)
      toaster.success(`Installed ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setActionPending(false)
    }
  }

  async function removeConnector() {
    try {
      setActionPending(true)
      await xkit.removeConnection({ slug })
      setConnection(undefined)
      setFields(undefined)
      toaster.success(`Removed ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setActionPending(false)
    }
  }

  async function reconnect() {
    try {
      setActionPending(true)
      const newConnection = await xkit.reconnect(connection)
      setConnection(newConnection)
      await loadSettings(connection)
      history.push(`${url}/settings`)
      toaster.success(`Reconnected to ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setActionPending(false)
      this.setState({ reconnectLoading: false })
    }
  }

  function openSettings() {
    history.push(`${url}/settings`)
  }

  function changeField(fieldName: string, value: string | string[] | boolean) {
    const changed = fields.map((field: SettingsField) => {
      if (field.name !== fieldName) return field
      return Object.assign({}, field, { value })
    })
    setFields(changed)
  }

  async function saveSettings() {
    if (!settingsUpdate || !connection) return

    try {
      setActionPending(true)
      const updatedFields = await settingsUpdate(connection, fields)
      setFields(updatedFields)

      const hasValidationErrors = updatedFields.some(field => Boolean(field.validationMessage))
      if (!hasValidationErrors) {
        history.push(url)
      }
    } catch (e) {
      toaster.danger(`Error while saving settings: ${e.message}`)
    } finally {
      setActionPending(false)
    }
  }

  function closeSettings() {
    history.push(url)
  }

  useEffect(() => {
    loadData(xkit, slug)
  }, [xkit, slug])

  if (isLoading) {
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

  const hasSettings = connection && connection.enabled && fields && fields.length > 0

  return (
    <Pane marginTop={majorScale(3)}>
      <Switch>
        {hasSettings &&
          <Route path={`${path}/settings`}>
            <ConnectorSettings
              connector={connector}
              fields={fields}
              isLoading={actionPending}
              onChangeField={changeField}
              onClickSave={saveSettings}
              onClickCancel={closeSettings}
            />
          </Route>
        }
        <Route>
          {connection && connectionStatus(connection) === ConnectionStatus.Error &&
            <Pane marginBottom={majorScale(3)}>
              <ConnectorAuthAlert
                connector={connector}
                isLoading={actionPending}
                onClickReconnect={reconnect}
              />
            </Pane>
          }
          <ConnectorInstallation
            connector={connector}
            connection={connection}
            isLoading={actionPending}
            hasSettings={hasSettings}
            onClickInstall={installConnector}
            onClickSettings={openSettings}
            onClickRemove={removeConnector}
          />
        </Route>
      </Switch>

      <Pane marginTop={majorScale(3)} display="flex" justifyContent="space-between">
        <BackButton is={Link} to="/">
          Back to Catalog
        </BackButton>
        <PoweredBy
          margin={0}
          align="right"
          removeBranding={removeBranding}
          campaign="catalog_detail_footer"
        />
      </Pane>
    </Pane>
  )
}

export default withXkit(withRouter(ConnectorDetails))
