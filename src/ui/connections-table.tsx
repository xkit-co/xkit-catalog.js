import * as React from 'react'
import { Connection, ConnectionStatus } from '@xkit-co/xkit.js'
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
import { connectionStatus, connectionName } from '../connection'
import useAsyncActionHandler from './async_action_handler'

interface MenuItemProps {
  icon?: React.ElementType | JSX.Element | null | false
  onSelect: () => void | Promise<void>
  intent?: string
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  onSelect,
  intent,
  children
}) => {
  const [isLoading, handleSelect] = useAsyncActionHandler(onSelect)

  return (
    <Menu.Item
      icon={isLoading ? <Spinner /> : icon}
      onSelect={handleSelect}
      intent={intent}
    >
      {children}
    </Menu.Item>
  )
}

interface ConnectionsTableProps {
  connections: Connection[]
  hasSettings: (connection: Connection) => boolean
  onSelectSettings: (connection: Connection) => void | Promise<void>
  onSelectReconnect: (connection: Connection) => void | Promise<void>
  onSelectRemove: (connection: Connection) => void | Promise<void>
}

const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections,
  hasSettings,
  onSelectSettings,
  onSelectReconnect,
  onSelectRemove
}) => {
  const rows = connections.map((connection) => {
    async function selectAndClose(
      select: (connection: Connection) => void | Promise<void>,
      close: () => void
    ): Promise<void> {
      await select(connection)
      close()
    }

    return (
      <Table.Row key={connection.id}>
        <Table.TextCell>{connectionName(connection)}</Table.TextCell>
        <Table.Cell width={128} flex='none'>
          <ConnectionStatusBadge useTooltip connections={[connection]} />
        </Table.Cell>
        <Table.Cell width={48} flex='none'>
          <Popover
            content={({ close }) => (
              <Menu>
                {hasSettings(connection) && (
                  <MenuItem
                    icon={CogIcon}
                    onSelect={async () =>
                      await selectAndClose(onSelectSettings, close)
                    }
                  >
                    Settings...
                  </MenuItem>
                )}
                {connectionStatus(connection) === ConnectionStatus.Error && (
                  <MenuItem
                    icon={RefreshIcon}
                    onSelect={async () =>
                      await selectAndClose(onSelectReconnect, close)
                    }
                  >
                    Reconnect...
                  </MenuItem>
                )}
                <MenuItem
                  icon={TrashIcon}
                  onSelect={async () =>
                    await selectAndClose(onSelectRemove, close)
                  }
                  intent='danger'
                >
                  Remove...
                </MenuItem>
              </Menu>
            )}
            position={Position.BOTTOM_RIGHT}
          >
            <IconButton icon={MoreIcon} height={24} appearance='minimal' />
          </Popover>
        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <Table border>
      <Table.Head>
        <Table.TextHeaderCell>Name</Table.TextHeaderCell>
        <Table.TextHeaderCell width={128} flex='none'>
          Status
        </Table.TextHeaderCell>
        <Table.HeaderCell width={48} flex='none' />
      </Table.Head>
      <Table.Body>{rows}</Table.Body>
    </Table>
  )
}

export default ConnectionsTable
