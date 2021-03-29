import React, { useEffect, useState } from 'react'
import {
  Redirect,
  Switch,
  Route,
  RouteComponentProps,
  Link,
  useHistory
} from 'react-router-dom'
import { XkitJs } from '@xkit-co/xkit.js'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection, ConnectionOnly } from '@xkit-co/xkit.js/lib/api/connection'
import { useXkit } from './xkit-context'
import { toaster } from './toaster'
import {
  Pane,
  Spinner,
  majorScale,
  BackButton,
} from '@treygriffith/evergreen-ui'
import { friendlyMessage } from './errors'
import { SettingsUpdate } from './app'
import { SettingsField } from './settings-form'
import ConnectorInstallation from './connector-installation'
import ConnectionSettings from './connection-settings'
import PoweredBy from './powered-by'
import PendingAction from './pending_action'

interface ConnectorDetailsProps {
  path: string,
  url: string,
  slug: string,
  removeBranding: boolean,
  settingsUpdate: SettingsUpdate
}

type Settings = Record<string, SettingsField[]>

const ConnectorDetails: React.FC<ConnectorDetailsProps> = ({
  path,
  url,
  slug,
  removeBranding,
  settingsUpdate
}) => {
  const xkit = useXkit()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState(PendingAction.None)
  const [connector, setConnector] = useState<Connector>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [fieldsChangeset, setFieldsChangeset] = useState<SettingsField[]>(null)

  async function loadData(xkit: XkitJs, slug: string) {
    setIsLoading(true)
    try {
      const connector = await xkit.getConnector(slug)
      const connections = (connector.connections || []).map((connection: ConnectionOnly): Connection => {
        return {...connection, connector: connector}
      })
      setConnector(connector)
      setConnections(connections)
      await loadSettings(connections)
    } catch (e) {
      toaster.danger(`Error while loading connector: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadSettings(connections: Connection[]) {
    if (!settingsUpdate) return

    try {
      const fields = await Promise.all(
        connections.map(connection => settingsUpdate(connection, undefined))
      )
      const settings: Settings = {}
      connections.forEach((connection, index) => settings[connection.id] = fields[index])
      setSettings(settings)
    } catch (e) {
      toaster.danger(`Error while loading settings: ${e.message}`)
    }
  }

  async function loadFields(connection: Connection) {
    if (!settingsUpdate) return

    try {
      return await settingsUpdate(connection, undefined)
    } catch (e) {
      toaster.danger(`Error while loading settings: ${e.message}`)
    }
  }

  async function addConnection() {
    try {
      setPendingAction(PendingAction.Install)
      const connection = await xkit.addConnection(connector)
      const fields = await loadFields(connection)
      setConnections([...connections, connection])
      setSettings({ ...settings, [connection.id]: fields })
      setFieldsChangeset(fields)
      history.push(`${url}/settings/${connection.id}`)
      toaster.success(`Installed ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setPendingAction(PendingAction.None)
    }
  }

  async function removeConnection(connection: Connection) {
    try {
      setPendingAction(PendingAction.Remove)
      await xkit.removeConnection({ id: connection.id })
      const updatedConnections = connections.filter(conn => conn.id !== connection.id)
      const { [connection.id]: fields, ...updatedSettings } = settings
      setConnections(updatedConnections)
      setSettings(updatedSettings)
      toaster.success(`Removed ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setPendingAction(PendingAction.None)
    }
  }

  async function reconnect(connection: Connection) {
    try {
      setPendingAction(PendingAction.Reconnect)
      const newConnection = await xkit.reconnect(connection)
      const fields = await loadFields(newConnection)

      const updatedConnections = connections.map(conn => {
        return conn.id === connection.id ? newConnection : conn
      })
      const updatedSettings = { ...settings, [connection.id]: fields }
      setConnections(updatedConnections)
      setSettings(updatedSettings)
      history.push(`${url}/settings/${connection.id}`)
      toaster.success(`Reconnected to ${connector.name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      setPendingAction(PendingAction.None)
    }
  }

  function openSettings(connection: Connection) {
    setFieldsChangeset(settings[connection.id])
    history.push(`${url}/settings/${connection.id}`)
  }

  function changeField(fieldName: string, value: string | string[] | boolean) {
    const changed = fieldsChangeset.map((field: SettingsField) => {
      if (field.name !== fieldName) return field
      return Object.assign({}, field, { value })
    })
    setFieldsChangeset(changed)
  }

  async function saveSettings(connection: Connection) {
    try {
      setPendingAction(PendingAction.Settings)
      const updatedFields = await settingsUpdate(connection, fieldsChangeset)
      setFieldsChangeset(updatedFields)
      const hasValidationErrors = updatedFields.some(field => Boolean(field.validationMessage))
      if (!hasValidationErrors) {
        setSettings({ ...settings, [connection.id]: updatedFields })
        history.push(url)
        setFieldsChangeset(null)
      }
    } catch (e) {
      toaster.danger(`Error while saving settings: ${e.message}`)
    } finally {
      setPendingAction(PendingAction.None)
    }
  }

  function closeSettings() {
    history.push(url)
    setFieldsChangeset(null)
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

  return (
    <Pane marginTop={majorScale(3)}>
      <Switch>
        <Route
          path={`${path}/settings/:connectionId`}
          render={({ match }: RouteComponentProps<{ connectionId: string }>) => {
            const connectionId = match.params.connectionId
            const connection = connections.find(conn => conn.id === connectionId)

            if (!connection || !fieldsChangeset) {
              return <Redirect to={url} />
            }

            return (
              <ConnectionSettings
                connector={connector}
                connection={connection}
                fields={fieldsChangeset}
                pendingAction={pendingAction}
                onChangeField={changeField}
                onClickSave={() => saveSettings(connection)}
                onClickCancel={closeSettings}
              />
            )
          }}
        />
        <Route>
          <ConnectorInstallation
            connector={connector}
            connections={connections}
            hasSettings={(connection) => settings[connection.id] && settings[connection.id].length > 0}
            pendingAction={pendingAction}
            onClickAddConnection={addConnection}
            onClickSettings={openSettings}
            onClickReconnect={reconnect}
            onClickRemoveConnection={removeConnection}
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

export default ConnectorDetails
