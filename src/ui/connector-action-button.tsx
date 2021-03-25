import * as React from 'react'
import {
  majorScale,
  Button,
  minorScale,
} from '@treygriffith/evergreen-ui'

interface ConnectorActionButtonProps {
  appearance?: string,
  isLoading?: boolean,
  iconBefore?: any,
  onClick: () => void | Promise<void>
}

const ConnectorActionButton: React.FC<ConnectorActionButtonProps> = ({
  appearance,
  isLoading,
  iconBefore,
  onClick,
  children
}) => {
  const appearanceProps = appearance ? { appearance: appearance } : {}
  const loading = isLoading || false

  return (
    <Button
      {...appearanceProps}
      iconBefore={loading ? null : iconBefore}
      marginTop={minorScale(1)}
      marginLeft={majorScale(1)}
      height={majorScale(5)}
      isLoading={loading}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default ConnectorActionButton
