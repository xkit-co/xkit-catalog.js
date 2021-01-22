import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Button,
  TextInputField,
} from '@treygriffith/evergreen-ui'
import SelectMenuField from './select-menu-field'
import SettingsText, {
  SettingsTextField,
  isSettingsTextField
} from './settings-text'
import SettingsSelect, {
  SettingsSelectField,
  isSettingsSelectField
} from './settings-select'
import { objsAreShallowEqual } from '../util'

export type SettingsField = SettingsTextField | SettingsSelectField
export type SettingsUpdate =  (fields: SettingsField[]) => SettingsField[] | Promise<SettingsField[]>

interface SettingsProps {
  onUpdate: SettingsUpdate,
  fields: SettingsField[],
  saveLabel?: string 
}

interface SettingsState {
  fields: SettingsField[]
}

function changeValue (fields: SettingsField[], name: string, value: string | string[]): SettingsField[] {
  return fields.map(field => {
    if (field.name !== name) {
      return field
    }

    return Object.assign({}, field, { value })
  })
}

interface SettingsFieldComponentProps {
  field: SettingsField
  onChange: (value: string | string[]) => void,
}

const SettingsFieldComponent: React.FC<SettingsFieldComponentProps> = ({ field, onChange }) => {
  if (isSettingsTextField(field)) {
    return <SettingsText field={field} onChange={onChange} />
  }

  if (isSettingsSelectField(field)) {
    return <SettingsSelect field={field} onChange={onChange} />
  }

  logger.warn(`Settings page does not support field with type '${field.type}'`)
}

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fields: props.fields.slice()
    }
  }

  componentDidUpdate (prevProps: SettingsProps) {
    if (prevProps !== this.props && prevProps.fields !== this.props.fields && !objsAreShallowEqual(prevProps.fields, this.props.fields)) {
      this.setState({
        fields: this.props.fields.slice()
      })
    }
  }

  handleSave = async (): Promise<void> => {
    try {
      const fields = await this.props.onUpdate(this.state.fields)
      this.setState({ fields })
    } catch (e) {
      logger.error(`Error while saving configuration settings: ${e}`)
    }
  }

  render () {
    const { saveLabel } = this.props
    const { fields } = this.state

    return (
      <Pane maxWidth={400}>
        {fields.map(field => (
          <SettingsFieldComponent
            key={field.name}
            field={field}
            onChange={(val) => this.setState({
              fields: changeValue(fields, field.name, val)
            })}
          />
        ))}
        <Button onClick={this.handleSave}>{saveLabel || 'Save'}</Button>
      </Pane>
    )
  }
}

export default Settings
