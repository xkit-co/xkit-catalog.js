import {
  AuthorizationStatus,
  Connection,
  ConnectionOnly,
  ConnectionShell,
  ConnectionStatus
} from '@xkit-co/xkit.js'
import { hasOwnProperty } from './util'

export function isConnection(
  conn: ConnectionOnly | ConnectionShell | undefined
): conn is Connection {
  return conn != null && hasOwnProperty(conn, 'enabled') && conn.enabled != null
}

export function connectionStatus(
  conn: ConnectionOnly | ConnectionShell | undefined
): ConnectionStatus {
  if (!isConnection(conn)) {
    return ConnectionStatus.NotInstalled
  }

  if (!conn.enabled) {
    return ConnectionStatus.NotInstalled
  }

  const { authorization } = conn
  if (
    authorization != null &&
    authorization.status !== AuthorizationStatus.error
  ) {
    return ConnectionStatus.Connected
  }

  return ConnectionStatus.Error
}

export function connectionName(connection: Connection): string {
  return (
    connection.authorization?.display_label ||
    `${connection.connector.slug}-${connection.id.slice(0, 4)}`
  )
}
