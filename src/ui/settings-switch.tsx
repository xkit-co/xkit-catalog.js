import * as React from 'react'
import { hasOwnProperty } from '../util'
import SwitchField from './switch-field'

export interface SettingsSwitchField {
  type: 'switch'
  name: string
  label?: string
  value?: boolean
  description?: string
  hint?: string
  validationMessage?: string
  [key: string]: string | boolean
}

export function isSettingsSwitchField(
  field: Record<string, unknown>
): field is SettingsSwitchField {
  return hasOwnProperty(field, 'type') && field.type === 'switch'
}

interface SettingsSwitchProps {
  field: SettingsSwitchField
  onChange: (value: boolean) => void
}

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({ onChange, field }) => {
  const { name, type, value, label, ...fieldProps } = field

  return (
    <SwitchField
      {...fieldProps}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.checked)
      }
      isInvalid={Boolean(fieldProps.validationMessage)}
      value={name}
      checked={value}
      label={label || name}
    />
  )
}

export default SettingsSwitch
