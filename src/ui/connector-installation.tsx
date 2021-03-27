import * as React from 'react'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection, ConnectionStatus, connectionStatus } from '@xkit-co/xkit.js/lib/api/connection'
import {
  AddIcon,
  Pane,
  TrashIcon,
  CogIcon,
  majorScale
} from '@treygriffith/evergreen-ui'
import ConnectionAuthAlert from './connection-auth-alert'
import ConnectionStatusBadge from './connection-status-badge'
import ConnectorDescription from './connector-description'
import ConnectorHeader from './connector-header'
import ConnectorActionButton from './connector-action-button'

interface InstallationHeaderProps {
  connector: Connector,
  connection: Connection
}

const InstallationHeader: React.FC<InstallationHeaderProps> = ({ connector, connection }) => {
  return (
    <ConnectorHeader
      mark_url={connector.mark_url}
      title={connector.name}
      subtitle={connector.short_description}
    >
      <ConnectionStatusBadge useTooltip={false} connections={[connection]} />
    </ConnectorHeader>
  )
}

interface ConnectorInstallationProps {
  connector: Connector,
  connection: Connection,
  isLoading: boolean,
  hasSettings: boolean,
  onClickInstall: () => void | Promise<void>
  onClickSettings: () => void | Promise<void>
  onClickRemove: () => void | Promise<void>
  onClickReconnect: () => void | Promise<void>
}

const ConnectorInstallation: React.FC<ConnectorInstallationProps> = ({
  connector,
  connection,
  isLoading,
  hasSettings,
  onClickInstall,
  onClickSettings,
  onClickRemove,
  onClickReconnect
}) => {
  return (
    <Pane>
      {connection && connectionStatus(connection) === ConnectionStatus.Error &&
        <Pane marginBottom={majorScale(3)}>
          <ConnectionAuthAlert
            connector={connector}
            isLoading={isLoading}
            onClickReconnect={onClickReconnect}
          />
        </Pane>
      }
      <Pane display="flex">
        <Pane flexGrow={1}>
          <InstallationHeader connector={connector} connection={connection} />
        </Pane>
        <Pane>
          {!(connection && connection.enabled) &&
            <ConnectorActionButton
              iconBefore={AddIcon}
              appearance="primary"
              isLoading={isLoading}
              onClick={onClickInstall}
            >
              Install
            </ConnectorActionButton>
          }

          {connection && connection.enabled &&
            <>
              <ConnectorActionButton
                iconBefore={TrashIcon}
                isLoading={isLoading}
                onClick={onClickRemove}
              >
                Remove
              </ConnectorActionButton>
              {hasSettings &&
                <ConnectorActionButton
                  iconBefore={CogIcon}
                  onClick={onClickSettings}
                >
                  Configure
                </ConnectorActionButton>
              }
            </>
          }
        </Pane>
      </Pane>
      <ConnectorDescription connector={connector} />
    </Pane>
  )
}

export default ConnectorInstallation
