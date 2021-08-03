import * as React from 'react'
import { TextInputField } from '@treygriffith/evergreen-ui'
import { hasOwnProperty } from '../util'

export interface SettingsTextField {
  type: 'text'
  name: string
  label?: string
  value?: string
  description?: string
  placeholder?: string
  hint?: string
  validationMessage?: string
  [key: string]: string
}

export function isSettingsTextField(
  field: Record<string, unknown>
): field is SettingsTextField {
  return hasOwnProperty(field, 'type') && field.type === 'text'
}

interface SettingsTextProps {
  field: SettingsTextField
  onChange: (value: string) => void
}

const SettingsText: React.FC<SettingsTextProps> = ({ onChange, field }) => {
  const { name, type, value, label, ...fieldProps } = field

  return (
    <TextInputField
      {...fieldProps}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      isInvalid={Boolean(fieldProps.validationMessage)}
      value={value == null ? '' : value}
      label={label || name}
    />
  )
}

export default SettingsText
