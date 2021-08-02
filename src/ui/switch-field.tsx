import * as React from 'react'
import {
  Switch,
  SwitchOwnProps,
  FormField,
  FormFieldProps,
  majorScale
} from '@treygriffith/evergreen-ui'

const SelectMenuField: React.FC<Omit<SwitchOwnProps & FormFieldProps, 'id'>> = (
  props
) => {
  const {
    name,
    value,
    height,
    checked,
    onChange,
    disabled,
    isInvalid,
    appearance,
    hasCheckIcon,
    defaultChecked,
    ...fieldProps
  } = props

  const switchProps = {
    name,
    value,
    height,
    checked,
    onChange,
    disabled,
    isInvalid,
    appearance,
    hasCheckIcon,
    defaultChecked
  }

  const [id] = React.useState(
    `switch-field-${Math.round(Math.random() * 10000)}`
  )

  return (
    <FormField marginBottom={majorScale(3)} labelFor={id} {...fieldProps}>
      <Switch id={id} {...switchProps} />
    </FormField>
  )
}

export default SelectMenuField
