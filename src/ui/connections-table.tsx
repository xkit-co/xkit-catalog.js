import * as React from 'react'
import {
  Connection,
  ConnectionStatus,
  connectionStatus
} from '@xkit-co/xkit.js/lib/api/connection'
import {
  CogIcon,
  IconButton,
  Menu,
  MoreIcon,
  Popover,
  Position,
  RefreshIcon,
  Spinner,
  Table,
  TrashIcon
} from '@treygriffith/evergreen-ui'
import ConnectionStatusBadge from './connection-status-badge'
import { isPending, ActionType, PendingAction } from './pending_action'

interface ConnectionsTableProps {
  connections: Connection[],
  hasSettings: (connection: Connection) => boolean,
  pendingAction: PendingAction,
  onSelectSettings: (connection: Connection) => void | Promise<void>,
  onSelectReconnect: (connection: Connection) => void | Promise<void>
  onSelectRemove: (connection: Connection) => void | Promise<void>
}

const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections,
  hasSettings,
  pendingAction,
  onSelectSettings,
  onSelectReconnect,
  onSelectRemove
}) => {
  const rows = connections.map(connection => {
    async function selectAndClose(
      select: (connection: Connection) => void | Promise<void>,
      close: () => void) {
      await select(connection)
      close()
    }

    return (
      <Table.Row key={connection.id}>
        <Table.TextCell>
          {connection.authorization?.display_label || connection.id}
        </Table.TextCell>
        <Table.Cell width={128} flex="none">
          <ConnectionStatusBadge useTooltip={true} connections={[connection]} />
        </Table.Cell>
        <Table.Cell width={48} flex="none">
          <Popover
            content={({ close }) => (
              <Menu>
                {hasSettings(connection) &&
                  <Menu.Item
                    icon={CogIcon}
                    onSelect={() => selectAndClose(onSelectSettings, close)}
                  >
                    Settings...
                  </Menu.Item>
                }
                {connectionStatus(connection) === ConnectionStatus.Error &&
                  <Menu.Item
                    icon={isPending(pendingAction, ActionType.Reconnect, connection) ? <Spinner /> : RefreshIcon}
                    onSelect={() => selectAndClose(onSelectReconnect, close)}
                  >
                    Reconnect...
                  </Menu.Item>
                }
                <Menu.Item
                  icon={isPending(pendingAction, ActionType.Remove, connection) ? <Spinner /> : TrashIcon}
                  onSelect={() => selectAndClose(onSelectRemove, close)} intent="danger"
                >
                  Remove...
                </Menu.Item>
              </Menu>
            )}
            position={Position.BOTTOM_RIGHT}
          >
            <IconButton icon={MoreIcon} height={24} appearance="minimal" />
          </Popover>
        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <Table border>
      <Table.Head>
        <Table.TextHeaderCell>
          Name
        </Table.TextHeaderCell>
        <Table.TextHeaderCell width={128} flex="none">
          Status
        </Table.TextHeaderCell>
        <Table.HeaderCell width={48} flex="none" />
      </Table.Head>
      <Table.Body>
        {rows}
      </Table.Body>
    </Table>
  )
}

export default ConnectionsTable
