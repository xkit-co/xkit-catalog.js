import React from 'react'
import {Pane, TabOwnProps, Text, useTheme} from '@treygriffith/evergreen-ui'

interface TabProps extends TabOwnProps {}

const Tab: React.FC<TabProps> = ({
  isSelected = false,
  onSelect = () => {},
  children
}) => {
  const theme = useTheme()

  const style = {
    fontSize: '12px',
    lineHeight: '16px',
    height: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 2px',
    marginRight: '20px',
    color: isSelected ? theme.colors.intent.none : theme.colors.text.default,
    position: 'relative',
    cursor: 'pointer'
  }

  const underlineStyle = {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    height: '2px',
    borderRadius: '2px 2px 0px 0px',
    backgroundColor: theme.colors.intent.none,
    width: '100%',
    transition: 'all 0.25s ease 0s',
    transform: `scaleY(${isSelected ? 1 : 0})`,
    transformOrigin: 'center bottom'
  }

  return (
    <Text style={style} onClick={onSelect}>
      <Pane style={underlineStyle}></Pane>
      {children}
    </Text>
  )
}

export default Tab
