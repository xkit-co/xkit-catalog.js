import * as React from 'react'
import { majorScale, Button, minorScale } from '@treygriffith/evergreen-ui'
import useAsyncActionHandler from './async_action_handler'

interface ConnectorActionButtonProps {
  appearance?: string
  iconBefore?: any
  onClick: () => void | Promise<void>
}

const ConnectorActionButton: React.FC<ConnectorActionButtonProps> = ({
  appearance,
  iconBefore,
  onClick,
  children
}) => {
  const [isLoading, handleClick] = useAsyncActionHandler(onClick)
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
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}

export default ConnectorActionButton
