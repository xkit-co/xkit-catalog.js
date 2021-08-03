import * as React from 'react'
import {
  Badge,
  Tooltip,
  Position,
  WarningSignIcon,
  minorScale
} from '@treygriffith/evergreen-ui'
import {
  ConnectionOnly,
  ConnectionShell,
  ConnectionStatus
} from '@xkit-co/xkit.js'
import { connectionStatus } from '../connection'

interface ConnectionStatusBadgeProps {
  connections: Array<ConnectionOnly | ConnectionShell>
  useTooltip: boolean
}

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  connections,
  useTooltip
}) => {
  let total = 0
  let hasDisconnected = false

  for (const connection of connections) {
    const status = connectionStatus(connection)
    if (status !== ConnectionStatus.NotInstalled) total += 1
    if (status === ConnectionStatus.Error) hasDisconnected = true
  }

  if (total === 0) return null

  let badgeColor = ''
  let badgeText = ''
  let tooltipText = ''

  if (total === 1 && hasDisconnected) {
    badgeColor = 'yellow'
    badgeText = 'Disconnected'
    tooltipText = 'Connection needs to be repaired'
  } else if (total === 1 && !hasDisconnected) {
    badgeColor = 'green'
    badgeText = 'Installed'
    tooltipText = 'Connection is installed and active'
  } else if (total > 1 && hasDisconnected) {
    badgeColor = 'yellow'
    badgeText = `${total} Installed`
    tooltipText = 'Some connections need repairing'
  } else if (total > 1 && !hasDisconnected) {
    badgeColor = 'green'
    badgeText = `${total} Installed`
    tooltipText = 'All connections are active'
  } else {
    return null
  }

  const badge = (
    <Badge color={badgeColor} display='flex' alignItems='center'>
      {hasDisconnected && total > 1 && (
        <WarningSignIcon size={minorScale(3)} style={{ marginRight: '3px' }} />
      )}
      {badgeText}
    </Badge>
  )

  return useTooltip ? (
    <Tooltip content={tooltipText} position={Position.TOP}>
      {badge}
    </Tooltip>
  ) : (
    badge
  )
}

export default ConnectionStatusBadge
