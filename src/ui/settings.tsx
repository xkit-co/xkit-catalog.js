import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Button,
  majorScale,
  minorScale
} from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection } from '@xkit-co/xkit.js/lib/api/connection'
import { Link } from 'react-router-dom'
import SelectMenuField from './select-menu-field'
import SettingsText, {
  SettingsTextField,
  isSettingsTextField
} from './settings-text'
import SettingsSelect, {
  SettingsSelectField,
  isSettingsSelectField
} from './settings-select'
import SettingsSwitch, {
  SettingsSwitchField,
  isSettingsSwitchField
} from './settings-switch'
import { logger } from '../util'
import ConnectorDetail from './connector-detail'
import { toaster } from './toaster'

export type SettingsField = SettingsTextField | SettingsSelectField | SettingsSwitchField
export type SettingsUpdate =  (fields: SettingsField[]) => SettingsField[] | Promise<SettingsField[]>

interface SettingsProps {
  removeBranding: boolean,
  connection: Connection,
  connector: Connector,
  updateConnection: (connection: Connection) => void,
  onUpdate: SettingsUpdate,
  fields: SettingsField[],
  url: string,
  saveLabel?: string
}

interface SettingsState {
  isLoading: boolean,
  fields: SettingsField[]
}

function changeValue (fields: SettingsField[], name: string, value: string | string[] | boolean): SettingsField[] {
  return fields.map(field => {
    if (field.name !== name) {
      return field
    }

    return Object.assign({}, field, { value })
  })
}

interface SettingsFieldComponentProps {
  field: SettingsField
  onChange: (value: string | string[] | boolean) => void,
}

const SettingsFieldComponent: React.FC<SettingsFieldComponentProps> = ({ field, onChange }) => {
  if (isSettingsTextField(field)) {
    return <SettingsText field={field} onChange={onChange} />
  }

  if (isSettingsSelectField(field)) {
    return <SettingsSelect field={field} onChange={onChange} />
  }

  if (isSettingsSwitchField(field)) {
    return <SettingsSwitch field={field} onChange={onChange} />
  }
}

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor (props: SettingsProps) {
    super(props)
    this.state = {
      fields: props.fields.slice(),
      isLoading: false
    }
  }

  componentDidUpdate (prevProps: SettingsProps) {
    if (prevProps !== this.props && prevProps.fields !== this.props.fields) {
      this.setState({
        fields: this.props.fields.slice()
      })
    }
  }

  handleSave = async (): Promise<void> => {
    const {
      onUpdate,
      connector
    } = this.props
    this.setState({ isLoading: true })
    try {
      const fields = await onUpdate(this.state.fields)
      this.setState({ fields })
      toaster.success(`Saved settings for ${connector.name}`)
    } catch (e) {
      toaster.danger(`Error while saving settings: ${e.message}`)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render () {
    const {
      saveLabel,
      removeBranding,
      connection,
      connector,
      updateConnection,
      url
    } = this.props
    const {
      fields,
      isLoading
    } = this.state

    return (
      <ConnectorDetail
        removeBranding={removeBranding}
        connection={connection}
        connector={connector}
        updateConnection={updateConnection}
        title="Settings"
        subtitle={`Configure settings for ${connector.name}`}
        actions={
          <>
            <Button
              marginLeft={majorScale(1)}
              marginTop={minorScale(1)}
              height={majorScale(5)}
              is={Link}
              to={url}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              marginLeft={majorScale(1)}
              marginTop={minorScale(1)}
              height={majorScale(5)}
              onClick={this.handleSave}
              isLoading={isLoading}
            >
              Save
            </Button>
          </> 
        }
      >
        <Pane
          marginTop={majorScale(3)}
          marginBottom={majorScale(5)}
          maxWidth={400}
        >
          {fields.map(field => (
            <SettingsFieldComponent
              key={field.name}
              field={field}
              onChange={(val) => this.setState({
                fields: changeValue(fields, field.name, val)
              })}
            />
          ))}
        </Pane>
      </ConnectorDetail>
    )
  }
}

export default Settings
