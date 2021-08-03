import React from 'react'
import {
  Alert,
  Button,
  RefreshIcon,
  Text,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js'
import useAsyncActionHandler from './async_action_handler'

interface ConnectionAuthAlertProps {
  connector: Connector
  onReconnect: () => void | Promise<void>
}

const ConnectionAuthAlert: React.FC<ConnectionAuthAlertProps> = ({
  connector,
  onReconnect
}) => {
  const [isReconnecting, handleReconnect] = useAsyncActionHandler(onReconnect)

  return (
    <Alert
      intent='warning'
      appearance='card'
      marginTop={majorScale(3)}
      title={
        <>
          Connection error
          <Button
            float='right'
            appearance='primary'
            iconBefore={isReconnecting ? null : RefreshIcon}
            isLoading={isReconnecting}
            height={majorScale(4)}
            onClick={handleReconnect}
          >
            Reconnect
          </Button>
        </>
      }
    >
      <Text size={400} color='muted'>
        Your connection to {connector.name} is inactive. Reconnect to continue
        using this integration.
      </Text>
    </Alert>
  )
}

export default ConnectionAuthAlert
