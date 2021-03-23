import * as React from 'react'
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

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ connection, useTooltip }) => {
  const status = connectionStatus(connection)

  if (status === ConnectionStatus.Connected) {
    const badge = <Badge color="green">Installed</Badge>

    return useTooltip
      ? <Tooltip content="Connection is installed and active" position={Position.TOP}>{badge}</Tooltip>
      : badge
  }

  if (status === ConnectionStatus.Error) {
    const badge = <Badge color="yellow">Disconnected</Badge>

    return useTooltip
      ? <Tooltip content="Connection needs to be repaired" position={Position.TOP}>{badge}</Tooltip>
      : badge
  }

  return null
}

export default ConnectionStatusBadge
