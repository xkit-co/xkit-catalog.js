import * as React from 'react'
import * as ReactDOM from 'react-dom'
import SelectMenuField from './select-menu-field'
import {
  Button,
  majorScale
} from '@treygriffith/evergreen-ui'
import { hasOwnProperty } from '@xkit-co/xkit.js/lib/util'

interface SelectOptionObj {
  value: string,
  label?: string
}

type SelectOption = SelectOptionObj | string

interface EvergreenSelectOption {
  value: string,
  label: string
}

interface SettingsSelectProto {
  name: string,
  options: SelectOption[],
  label?: string,
  description?: string,
  placeholder?: string,
  hint?: string,
  validationMessage?: string
}

interface SettingsSelectSingleField extends SettingsSelectProto {
  type: 'select',
  value: string
}

interface SettingsSelectMultipleField extends SettingsSelectProto {
  type: 'select-multiple',
  value: string[]
}

export type SettingsSelectField = SettingsSelectSingleField | SettingsSelectMultipleField

export function isSettingsSelectField (field: Record<string, unknown>): field is SettingsSelectField {
  return hasOwnProperty(field, 'type') && (field.type === 'select' || field.type === 'select-multiple')
}

function isMulti (field: SettingsSelectField): field is SettingsSelectMultipleField {
  return hasOwnProperty(field, 'type') && field.type === 'select-multiple'
}

function isSingle (field: SettingsSelectField): field is SettingsSelectSingleField {
  return hasOwnProperty(field, 'type') && field.type === 'select'
}

function fillOptions(opts: SelectOption[]): EvergreenSelectOption[] {
  return opts.map(opt => {
    if (typeof opt === 'string') {
      return {
        value: opt,
        label: opt
      }
    }

    return {
      value: opt.value,
      label: opt.label ? opt.label : opt.value
    }
  })
}

interface SettingsSelectProps {
  field: SettingsSelectField,
  onChange: (value: string) => void
}

function multiSelectButtonText (placeholder?: string, value?: string[]): string {
  if (value == null || !value.length) {
    return placeholder || 'Select many...'
  }

  if (value.length === 1) {
    return `Selected: ${value[0]}`
  }

  return `Selected: ${value[0]} + ${value.length - 1} more`
}

const SettingsSelect: React.FC<SettingsSelectProps> = ({ onChange, field }) => {
  const {
    name,
    type,
    label,
    options,
    placeholder,
    ...fieldProps
  } = field

  if (isSingle(field)) {
    const { value } = field

    const placeholderToUse = field.placeholder || 'Select one...'

    const selectedText = value ? `Selected: ${value}` : placeholderToUse

    return (
      <SelectMenuField
        {...fieldProps}
        hasTitle={false}
        intent={Boolean(fieldProps.validationMessage) ? 'danger' : 'none'}
        label={label ? label : name}
        selected={value}
        options={fillOptions(options)}
        onSelect={opt => onChange(opt.value)}
        closeOnSelect
      >
        <Button
          intent={Boolean(fieldProps.validationMessage) ? 'danger' : 'none'}
          height={majorScale(5)}
        >
          {selectedText}
        </Button>
      </SelectMenuField>
    )
  }

  if (isMulti(field)) {
    const { value } = field

    return (
      <SelectMenuField
        {...fieldProps}
        hasTitle={false}
        isMultiSelect
        label={label ? label : name}
        selected={value}
        options={fillOptions(options)}
        onSelect={opt => onChange(value ? value.concat(opt.value) : [opt.value])}
        onDeselect={opt => onChange(value ? value.filter(val => val !== opt.value) : [])}
      >
        <Button
          intent={Boolean(fieldProps.validationMessage) ? 'danger' : 'none'}
          height={majorScale(5)}
        >
          {multiSelectButtonText(placeholder, value)}
        </Button>
      </SelectMenuField>
    )
  }
}

export default SettingsSelect
