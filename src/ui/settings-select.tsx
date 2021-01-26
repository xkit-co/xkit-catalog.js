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
  validationMessage?: string,
  [key: string]: string | string[] | SelectOption[]
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

export function isSettingsSelectField (field: { [key: string]: unknown }): field is SettingsSelectField {
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
  onChange: (value: string | string[]) => void
}

function multiSelectButtonText (placeholder?: string, value?: string[], evergreenOptions: EvergreenSelectOption[]): string {
  if (value == null || !value.length) {
    return placeholder || 'Select many...'
  }

  if (value.length === 1) {
    return `Selected: ${valueLabel(value[0], evergreenOptions)}`
  }

  return `Selected: ${valueLabel(value[0], evergreenOptions)} + ${value.length - 1} more`
}

function valueLabel (value?: string, evergreenOptions: EvergreenSelectOption[]): string {
  const selectedOption = value ? evergreenOptions.find(opt => opt.value === value) : undefined
  return selectedOption ? selectedOption.label : value
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

  const evergreenOptions = fillOptions(options)

  if (isSingle(field)) {
    const { value } = field

    const placeholderToUse = field.placeholder || 'Select one...'

    const selectedText = value ? `Selected: ${valueLabel(value, evergreenOptions)}` : placeholderToUse

    return (
      <SelectMenuField
        {...fieldProps}
        hasTitle={false}
        intent={Boolean(fieldProps.validationMessage) ? 'danger' : 'none'}
        label={label ? label : name}
        selected={value}
        options={evergreenOptions}
        onSelect={(opt: EvergreenSelectOption) => onChange(opt.value)}
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
        options={evergreenOptions}
        onSelect={(opt: EvergreenSelectOption) => onChange(value ? value.concat(opt.value) : [opt.value])}
        onDeselect={(opt: EvergreenSelectOption) => onChange(value ? value.filter(val => val !== opt.value) : [])}
      >
        <Button
          intent={Boolean(fieldProps.validationMessage) ? 'danger' : 'none'}
          height={majorScale(5)}
        >
          {multiSelectButtonText(placeholder, value, evergreenOptions)}
        </Button>
      </SelectMenuField>
    )
  }
}

export default SettingsSelect
