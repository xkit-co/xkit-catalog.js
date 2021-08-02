import React from 'react'
import { Tab as EgTab, TabOwnProps } from '@treygriffith/evergreen-ui'

const Tab: React.FC<TabOwnProps> = ({
  isSelected = false,
  onSelect = () => {},
  children,
  ...rest
}) => {
  return (
    <EgTab
      isSelected={isSelected}
      onSelect={onSelect}
      appearance='minimal'
      height={40}
      size={300}
      paddingTop={12}
      paddingBottom={12}
      paddingLeft={2}
      paddingRight={2}
      marginLeft={0}
      marginRight={20}
      {...rest}
    >
      {children}
    </EgTab>
  )
}

export default Tab
