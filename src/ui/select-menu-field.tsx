import * as React from 'react'
import {
  SelectMenu,
  SelectMenuProps,
  FormField,
  FormFieldProps,
  majorScale
} from '@treygriffith/evergreen-ui'

const SelectMenuField: React.FC<SelectMenuProps & FormFieldProps> = (props) => {
  const {
    title,
    width,
    height,
    options,
    selected,
    isMultiSelect,
    hasTitle,
    hasFilter,
    position,
    detailView,
    emptyView,
    titleView,
    onSelect,
    onDeselect,
    onFilterChange,
    filterPlaceholder,
    filterIcon,
    closeOnSelect,
    ...fieldProps
  } = props

  const selectProps = {
    title,
    width,
    height,
    options,
    selected,
    isMultiSelect,
    hasTitle,
    hasFilter,
    position,
    detailView,
    emptyView,
    titleView,
    onSelect,
    onDeselect,
    onFilterChange,
    filterPlaceholder,
    filterIcon,
    closeOnSelect
  }

  return (
    <FormField marginBottom={majorScale(3)} {...fieldProps}>
      <SelectMenu {...selectProps}>{props.children}</SelectMenu>
    </FormField>
  )
}

export default SelectMenuField
