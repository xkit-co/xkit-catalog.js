import React, { useEffect } from 'react'
import { majorScale, Pane } from '@treygriffith/evergreen-ui'
import { Connector, Connection } from '@xkit-co/xkit.js'
import SettingsForm, { SettingsField } from './settings-form'
import ConnectorHeader from './connector-header'
import ConnectorActionButton from './connector-action-button'
import { connectionName } from '../connection'
import { LocationListener } from './app'

interface SettingsHeaderProps {
  connector: Connector
  connection: Connection
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  connector,
  connection
}) => {
  const subtitle = connector.supports_multiple_connections
    ? `Configure settings for ${connectionName(connection)}`
    : `Configure settings for ${connector.name}`

  return (
    <ConnectorHeader
      mark_url={connector.mark_url}
      title='Settings'
      subtitle={subtitle}
    />
  )
}

interface ConnectionSettingsProps {
  connector: Connector
  connection: Connection
  fields: SettingsField[]
  onChangeField: (fieldName: string, value: string | string[] | boolean) => void
  onSave: () => void | Promise<void>
  onCancel: () => void | Promise<void>
  onLocationChange: LocationListener
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  connector,
  connection,
  fields,
  onChangeField,
  onSave,
  onCancel,
  onLocationChange
}) => {
  useEffect(() => {
    onLocationChange({
      name: 'connectionSettings',
      connectorSlug: connector.slug,
      connectionId: connection.id
    })
  }, [onLocationChange, connection.id, connector.slug])

  return (
    <Pane>
      <Pane display='flex'>
        <Pane flexGrow={1}>
          <SettingsHeader connector={connector} connection={connection} />
        </Pane>
        <Pane>
          <ConnectorActionButton onClick={onCancel}>
            Cancel
          </ConnectorActionButton>
          <ConnectorActionButton appearance='primary' onClick={onSave}>
            Save
          </ConnectorActionButton>
        </Pane>
      </Pane>
      <Pane marginTop={majorScale(3)} marginBottom={majorScale(5)}>
        <SettingsForm fields={fields} onChangeField={onChangeField} />
      </Pane>
    </Pane>
  )
}

export default ConnectionSettings
