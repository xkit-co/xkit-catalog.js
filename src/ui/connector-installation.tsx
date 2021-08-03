import React, { useState, useEffect } from 'react'
import { Connector, Connection, ConnectionStatus } from '@xkit-co/xkit.js'
import {
  AddIcon,
  Pane,
  TrashIcon,
  CogIcon,
  Tablist,
  majorScale
} from '@treygriffith/evergreen-ui'
import ConnectionAuthAlert from './connection-auth-alert'
import ConnectionStatusBadge from './connection-status-badge'
import ConnectorDescription from './connector-description'
import ConnectorHeader from './connector-header'
import ConnectorActionButton from './connector-action-button'
import ConnectionsTable from './connections-table'
import Tab from './tab'
import { connectionStatus } from '../connection'
import { LocationListener } from './app'

interface InstallationHeaderProps {
  connector: Connector
  connections: Connection[]
  showBadge: boolean
}

const InstallationHeader: React.FC<InstallationHeaderProps> = ({
  connector,
  connections,
  showBadge
}) => {
  return (
    <ConnectorHeader
      mark_url={connector.mark_url}
      title={connector.name}
      subtitle={connector.short_description}
    >
      {showBadge && (
        <ConnectionStatusBadge useTooltip={false} connections={connections} />
      )}
    </ConnectorHeader>
  )
}

interface ConnectorInstallationProps {
  connector: Connector
  connections: Connection[]
  hasSettings: (connection: Connection) => boolean
  onAddConnection: () => void | Promise<void>
  onOpenSettings: (connection: Connection) => void | Promise<void>
  onReconnect: (connection: Connection) => void | Promise<void>
  onRemoveConnection: (connection: Connection) => void | Promise<void>
  onLocationChange: LocationListener
}

const ConnectorInstallation: React.FC<ConnectorInstallationProps> = ({
  connector,
  connections,
  hasSettings,
  onAddConnection,
  onOpenSettings,
  onReconnect,
  onRemoveConnection,
  onLocationChange
}) => {
  const [currentTab, setCurrentTab] = useState('connections')
  const multipleConnections =
    connector.supports_multiple_connections || connections.length > 1
  const computedTab =
    !multipleConnections || connections.length === 0 ? 'about' : currentTab

  useEffect(() => {
    onLocationChange({ name: 'connector', connectorSlug: connector.slug })
  }, [onLocationChange, connector.slug])

  return (
    <Pane>
      {!multipleConnections &&
        connections.length === 1 &&
        connectionStatus(connections[0]) === ConnectionStatus.Error && (
          <Pane marginBottom={majorScale(3)}>
            <ConnectionAuthAlert
              connector={connector}
              onReconnect={() => onReconnect(connections[0])}
            />
          </Pane>
        )}
      <Pane display='flex'>
        <Pane flexGrow={1}>
          <InstallationHeader
            connector={connector}
            connections={connections}
            showBadge={!multipleConnections}
          />
        </Pane>
        <Pane>
          {connections.length === 0 && (
            <ConnectorActionButton
              iconBefore={AddIcon}
              appearance='primary'
              onClick={onAddConnection}
            >
              Install
            </ConnectorActionButton>
          )}

          {multipleConnections && connections.length > 0 && (
            <ConnectorActionButton
              iconBefore={AddIcon}
              onClick={onAddConnection}
            >
              Add Connection
            </ConnectorActionButton>
          )}

          {!multipleConnections && connections.length === 1 && (
            <>
              <ConnectorActionButton
                iconBefore={TrashIcon}
                onClick={() => onRemoveConnection(connections[0])}
              >
                Remove
              </ConnectorActionButton>
              {hasSettings(connections[0]) && (
                <ConnectorActionButton
                  iconBefore={CogIcon}
                  onClick={() => onOpenSettings(connections[0])}
                >
                  Configure
                </ConnectorActionButton>
              )}
            </>
          )}
        </Pane>
      </Pane>

      {multipleConnections && connections.length > 0 && (
        <Tablist marginBottom={majorScale(2)} marginTop={majorScale(2)}>
          <Tab
            key='connections'
            onSelect={() => setCurrentTab('connections')}
            isSelected={computedTab === 'connections'}
          >
            Connections
          </Tab>
          <Tab
            key='about'
            onSelect={() => setCurrentTab('about')}
            isSelected={computedTab === 'about'}
          >
            About
          </Tab>
        </Tablist>
      )}

      <Pane marginTop={majorScale(2)} marginBottom={majorScale(4)}>
        <Pane display={computedTab === 'connections' ? 'block' : 'none'}>
          <ConnectionsTable
            connections={connections}
            hasSettings={hasSettings}
            onSelectSettings={onOpenSettings}
            onSelectReconnect={onReconnect}
            onSelectRemove={onRemoveConnection}
          />
        </Pane>
        <Pane display={computedTab === 'about' ? 'block' : 'none'}>
          <ConnectorDescription connector={connector} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default ConnectorInstallation
