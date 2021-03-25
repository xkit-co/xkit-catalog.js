import * as React from 'react'
import { ConnectionOnly } from '@xkit-co/xkit.js/lib/api/connection'
import ConnectionStatusBadge from './connection-status-badge'
import {
  CogIcon,
  IconButton,
  Menu,
  MoreIcon,
  Popover,
  Position,
  Table,
  TrashIcon
} from '@treygriffith/evergreen-ui'

interface ConnectionsTableProps {
  connections: ConnectionOnly[],
  onSelectSettings: (connection: ConnectionOnly) => void | Promise<void>,
  onSelectRemove: (connection: ConnectionOnly) => void | Promise<void>
}

const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections,
  onSelectSettings,
  onSelectRemove
}) => {
  const rows = connections.map(connection => {
    const menu = (
      <Menu>
        <Menu.Item icon={CogIcon} onSelect={() => onSelectSettings(connection)}>
          Settings...
        </Menu.Item>
        <Menu.Item icon={TrashIcon} onSelect={() => onSelectRemove(connection)}>
          Remove...
        </Menu.Item>
      </Menu>
    )

    return (
      <Table.Row>
        <Table.TextCell>
          {connection.authorization?.display_label || connection.id}
        </Table.TextCell>
        <Table.Cell width={128} flex="none">
          <ConnectionStatusBadge useTooltip={true} connections={[connection]} />
        </Table.Cell>
        <Table.Cell width={48} flex="none">
          <Popover content={menu} position={Position.BOTTOM_RIGHT}>
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
