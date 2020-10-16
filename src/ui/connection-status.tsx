import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Badge } from '@treygriffith/evergreen-ui'
import {
  ConnectionOnly,
  ConnectionShell,
  connectionStatus,
  ConnectionStatus
} from '@xkit-co/xkit.js/lib/api/connection'

interface ConnectionStatusBadgeProps {
  connection?: ConnectionOnly | ConnectionShell
}

class ConnectionStatusBadge extends React.Component<ConnectionStatusBadgeProps> {
  render () {
    const { connection } = this.props
    const status = connectionStatus(connection)

    if (status === ConnectionStatus.Connected) {
      return <Badge color="green">Installed</Badge>
    }

    if (status === ConnectionStatus.Error) {
      return <Badge color="yellow">Disconnected</Badge>
    }

    return null
  }
}

export default ConnectionStatusBadge
