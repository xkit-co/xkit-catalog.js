import React, { useState } from 'react'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import {
  ConnectionOnly,
  ConnectionStatus,
  connectionStatus
} from '@xkit-co/xkit.js/lib/api/connection'
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
import PendingAction from './pending_action'

interface InstallationHeaderProps {
  connector: Connector,
  connections: ConnectionOnly[],
  showBadge: boolean
}

const InstallationHeader: React.FC<InstallationHeaderProps> = ({ connector, connections, showBadge }) => {
  return (
    <ConnectorHeader
      mark_url={connector.mark_url}
      title={connector.name}
      subtitle={connector.short_description}
    >
      {showBadge && <ConnectionStatusBadge useTooltip={false} connections={connections} />}
    </ConnectorHeader>
  )
}

interface ConnectorInstallationProps {
  connector: Connector,
  multipleConnections: boolean,
  connections: ConnectionOnly[],
  hasSettings: (connection: ConnectionOnly) => boolean,
  pendingAction: PendingAction,
  onClickAddConnection: () => void | Promise<void>
  onClickSettings: (connection: ConnectionOnly) => void | Promise<void>
  onClickReconnect: (connection: ConnectionOnly) => void | Promise<void>
  onClickRemoveConnection: (connection: ConnectionOnly) => void | Promise<void>
}

const ConnectorInstallation: React.FC<ConnectorInstallationProps> = ({
  connector,
  multipleConnections,
  connections,
  pendingAction,
  hasSettings,
  onClickAddConnection,
  onClickSettings,
  onClickReconnect,
  onClickRemoveConnection
}) => {
  const [currentTab, setCurrentTab] = useState('connections')
  const computedTab = !multipleConnections || connections.length === 0 ? 'about' : currentTab

  return (
    <Pane>
      {!multipleConnections && connections.length === 1 && connectionStatus(connections[0]) === ConnectionStatus.Error &&
        <Pane marginBottom={majorScale(3)}>
          <ConnectionAuthAlert
            connector={connector}
            isLoading={pendingAction === PendingAction.Reconnect}
            onClickReconnect={() => onClickReconnect(connections[0])}
          />
        </Pane>
      }
      <Pane display="flex">
        <Pane flexGrow={1}>
          <InstallationHeader
            connector={connector}
            connections={connections}
            showBadge={!multipleConnections}
          />
        </Pane>
        <Pane>
          {connections.length === 0 &&
            <ConnectorActionButton
              iconBefore={AddIcon}
              appearance="primary"
              isLoading={pendingAction === PendingAction.Install}
              onClick={onClickAddConnection}
            >
              Install
            </ConnectorActionButton>
          }

          {multipleConnections && connections.length > 0 &&
            <ConnectorActionButton
              iconBefore={AddIcon}
              isLoading={pendingAction === PendingAction.Install}
              onClick={onClickAddConnection}
            >
              Add Connection
            </ConnectorActionButton>
          }

          {!multipleConnections && connections.length === 1 &&
            <>
              <ConnectorActionButton
                iconBefore={TrashIcon}
                isLoading={pendingAction === PendingAction.Remove}
                onClick={() => onClickRemoveConnection(connections[0])}
              >
                Remove
              </ConnectorActionButton>
              {hasSettings(connections[0]) &&
                <ConnectorActionButton
                  iconBefore={CogIcon}
                  onClick={() => onClickSettings(connections[0])}
                >
                  Configure
                </ConnectorActionButton>
              }
            </>
          }
        </Pane>
      </Pane>

      {multipleConnections && connections.length > 0 &&
        <Tablist marginBottom={majorScale(2)} marginTop={majorScale(2)}>
          <Tab
            key="connections"
            onSelect={() => setCurrentTab('connections')}
            isSelected={computedTab === 'connections'}
          >
            Connections
          </Tab>
          <Tab
            key="about"
            onSelect={() => setCurrentTab('about')}
            isSelected={computedTab === 'about'}
          >
            About
          </Tab>
        </Tablist>
      }

      <Pane marginTop={majorScale(2)} marginBottom={majorScale(4)}>
        <Pane display={computedTab === 'connections' ? 'block' : 'none'}>
          <ConnectionsTable
            connections={connections}
            hasSettings={hasSettings}
            pendingAction={pendingAction}
            onSelectSettings={onClickSettings}
            onSelectReconnect={onClickReconnect}
            onSelectRemove={onClickRemoveConnection}
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
