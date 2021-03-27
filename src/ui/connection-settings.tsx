import * as React from 'react'
import { majorScale, Pane } from 'evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import SettingsForm, { SettingsField } from './settings-form'
import ConnectorHeader from './connector-header'
import ConnectorActionButton from './connector-action-button'

interface SettingsHeaderProps {
  connector: Connector
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ connector }) => {
  return (
    <ConnectorHeader
      mark_url={connector.mark_url}
      title="Settings"
      subtitle={`Configure settings for ${connector.name}`}
    />
  )
}

interface ConnectionSettingsProps {
  connector: Connector,
  fields: SettingsField[],
  isLoading: boolean,
  onChangeField: (fieldName: string, value: string | string[] | boolean) => void,
  onClickSave: () => void | Promise<void>
  onClickCancel: () => void | Promise<void>
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ connector, fields, isLoading, onChangeField, onClickSave, onClickCancel }) => {
  return (
    <Pane>
      <Pane display="flex">
        <Pane flexGrow={1}>
          <SettingsHeader connector={connector} />
        </Pane>
        <Pane>
          <ConnectorActionButton
            isLoading={isLoading}
            onClick={onClickCancel}
          >
            Cancel
          </ConnectorActionButton>
          <ConnectorActionButton
            appearance="primary"
            isLoading={isLoading}
            onClick={onClickSave}
          >
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
