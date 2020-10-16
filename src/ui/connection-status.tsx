import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Badge,
  Tooltip,
  Position,
} from '@treygriffith/evergreen-ui'
import {
  ConnectionOnly,
  ConnectionShell,
  connectionStatus,
  ConnectionStatus
} from '@xkit-co/xkit.js/lib/api/connection'

interface ConnectionStatusBadgeProps {
  connection?: ConnectionOnly | ConnectionShell,
  useTooltip?: boolean
}

class ConnectionStatusBadgeOnly extends React.Component<{status: ConnectionStatus}> {
  render () {
    const { status } = this.props
    if (status === ConnectionStatus.Connected) {
      return <Badge color="green">Installed</Badge>
    }

    if (status === ConnectionStatus.Error) {
      return <Badge color="yellow">Disconnected</Badge>
    }

    return null
  }
}

class ConnectionStatusBadgeTooltip extends React.Component<{status: ConnectionStatus}> {
  render () {
    const { status } = this.props

    if (status === ConnectionStatus.Connected) {
      // this is duplicative of the above, but tooltip refs make it hard to abstract
      return (
        <Tooltip content="Connection is installed and active" position={Position.TOP}>
          <Badge color="green">Installed</Badge>
        </Tooltip>
      )
    }

    if (status === ConnectionStatus.Error) {
      return (
        <Tooltip content="Connection needs to be repaired" position={Position.TOP}>
          <Badge color="yellow">Disconnected</Badge>
        </Tooltip>
      )
    }

    return null
  }
}

class ConnectionStatusBadge extends React.Component<ConnectionStatusBadgeProps> {
  render () {
    const { connection, useTooltip } = this.props
    const status = connectionStatus(connection)

    if (useTooltip) {
      return <ConnectionStatusBadgeTooltip status={status} />
    }

    return <ConnectionStatusBadgeOnly status={status} />
  }
}

export default ConnectionStatusBadge
