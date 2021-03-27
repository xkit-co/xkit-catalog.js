import React from 'react'
import { Alert, Button, RefreshIcon, Text, majorScale } from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'

interface ConnectionAuthAlertProps {
  connector: Connector,
  isLoading: boolean,
  onClickReconnect: () => void | Promise<void>
}

const ConnectionAuthAlert: React.FC<ConnectionAuthAlertProps> = ({
  connector,
  isLoading,
  onClickReconnect
}) => {
  return (
    <Alert
      intent="warning"
      appearance="card"
      marginTop={majorScale(3)}
      title={
        <>
          Connection error
          <Button
            float="right"
            appearance="primary"
            iconBefore={isLoading ? null : RefreshIcon}
            isLoading={isLoading}
            height={majorScale(4)}
            onClick={onClickReconnect}
          >
            Reconnect
          </Button>
        </>
      }
    >
      <Text size={400} color="muted">
        Your connection to {connector.name} is inactive. Reconnect to continue using this integration.
      </Text>
    </Alert>
  )
}

export default ConnectionAuthAlert
