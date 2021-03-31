import React from 'react'
import { Alert, Button, RefreshIcon, Text, majorScale } from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import useAsyncActionHandler from './async_action_handler'

interface ConnectionAuthAlertProps {
  connector: Connector,
  onClickReconnect: () => void | Promise<void>
}

const ConnectionAuthAlert: React.FC<ConnectionAuthAlertProps> = ({
  connector,
  onClickReconnect
}) => {
  const [isLoading, handleAction] = useAsyncActionHandler(onClickReconnect)

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
            onClick={handleAction}
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
