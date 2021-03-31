import * as React from 'react'
import { majorScale, Pane } from 'evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection } from '@xkit-co/xkit.js/lib/api/connection'
import SettingsForm, { SettingsField } from './settings-form'
import ConnectorHeader from './connector-header'
import ConnectorActionButton from './connector-action-button'
import connectionName from './connection_name'

interface SettingsHeaderProps {
  connector: Connector,
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
    <ConnectorHeader mark_url={connector.mark_url} title="Settings" subtitle={subtitle} />
  )
}

interface ConnectionSettingsProps {
  connector: Connector,
  connection: Connection,
  fields: SettingsField[],
  onChangeField: (fieldName: string, value: string | string[] | boolean) => void,
  onClickSave: () => void | Promise<void>
  onClickCancel: () => void | Promise<void>
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  connector,
  connection,
  fields,
  onChangeField,
  onClickSave,
  onClickCancel
}) => {
  return (
    <Pane>
      <Pane display="flex">
        <Pane flexGrow={1}>
          <SettingsHeader connector={connector} connection={connection} />
        </Pane>
        <Pane>
          <ConnectorActionButton onClick={onClickCancel}>
            Cancel
          </ConnectorActionButton>
          <ConnectorActionButton appearance="primary" onClick={onClickSave}>
            Save
          </ConnectorActionButton>
        </Pane>
      </Pane>
      <Pane marginTop={majorScale(3)} marginBottom={majorScale(5)}>
        <SettingsForm
          fields={fields}
          onChangeField={onChangeField}
        />
      </Pane>
    </Pane>
  )
}

export default ConnectionSettings
