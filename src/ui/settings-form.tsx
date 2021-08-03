import React from 'react'
import { Pane } from '@treygriffith/evergreen-ui'
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

export type SettingsField =
  | SettingsTextField
  | SettingsSelectField
  | SettingsSwitchField

interface SettingsFieldInputProps {
  field: SettingsField
  onChange: (value: string | string[] | boolean) => void
}

const SettingsFieldInput: React.FC<SettingsFieldInputProps> = ({
  field,
  onChange
}) => {
  if (isSettingsTextField(field)) {
    return <SettingsText field={field} onChange={onChange} />
  }

  if (isSettingsSelectField(field)) {
    return <SettingsSelect field={field} onChange={onChange} />
  }

  if (isSettingsSwitchField(field)) {
    return <SettingsSwitch field={field} onChange={onChange} />
  }

  logger.warn(`Ignored unsupported settings field type "${field}".`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
  return null
}

interface SettingsFormProps {
  fields: SettingsField[]
  onChangeField: (fieldName: string, value: string | string[] | boolean) => void
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  fields,
  onChangeField
}) => {
  return (
    <Pane maxWidth={400}>
      {fields.map((field) => (
        <SettingsFieldInput
          key={field.name}
          field={field}
          onChange={(value) => onChangeField(field.name, value)}
        />
      ))}
    </Pane>
  )
}

export default SettingsForm
