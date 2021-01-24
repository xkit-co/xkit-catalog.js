import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Alert,
  Pane,
  Heading,
  Button,
  BackButton,
  Text,
  RefreshIcon,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Link } from 'react-router-dom'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import {
  Connection,
  ConnectionStatus,
  connectionStatus
} from '@xkit-co/xkit.js/lib/api/connection'
import { toaster } from './toaster'
import ConnectionStatusBadge from './connection-status'
import ConnectorMark from './connector-mark'
import { friendlyMessage } from './errors'
import withXkit, { XkitConsumer } from './with-xkit'
import PoweredBy from './powered-by'
import Settings, { SettingsField } from './settings'
import { logger } from '../util'

interface ConnectorDetailProps {
  removeBranding: boolean,
  title: string,
  subtitle: string,
  actions: React.ReactElement,
  connector: Connector,
  connection?: Connection,
  updateConnection: (connection: Connection) => void
}

interface ConnectorDetailState {
  reconnectLoading: boolean,
}

class ConnectorDetail extends React.Component<XkitConsumer<ConnectorDetailProps>, ConnectorDetailState> {
  constructor (props: XkitConsumer<ConnectorDetailProps>) {
    super(props)

    this.state = {
      reconnectLoading: false
    }
  }

  handleReconnect = async (): Promise<void> => {
    const {
      xkit,
      connector: {
        name
      },
      connection
    } = this.props
    try {
      this.setState({ reconnectLoading: true })
      const newConnection = await xkit.reconnect(connection)
      this.props.updateConnection(newConnection)
      toaster.success(`Reconnected to ${name}`)
    } catch (e) {
      toaster.danger(friendlyMessage(e.message))
    } finally {
      this.setState({ reconnectLoading: false })
    }
  }

  renderAuthAlert (): React.ReactElement {
    const {
      connector,
      connection
    } = this.props
    const { reconnectLoading } = this.state
    const status = connectionStatus(connection)

    if (status !== ConnectionStatus.Error) {
      return
    }

    return (
      <Alert
        intent="warning"
        appearance="card"
        marginTop={majorScale(3)}
        title={
          <>
            Connection error
            <Button
              float="right"
              appearance="primary"
              iconBefore={reconnectLoading ? null : RefreshIcon}
              isLoading={reconnectLoading}
              height={majorScale(4)}
              onClick={this.handleReconnect}
            >
              Reconnect
            </Button>
          </>
        }
      >
        <Text size={400} color="muted">
          Your connection to {connector.name} is inactive. Reconnect to continue using this integration.
        </Text>
      </Alert>
    )
  }

  render (): React.ReactElement {
    const {
      removeBranding,
      connector: {
        mark_url
      },
      connection,
      title,
      subtitle,
      children,
      actions
    } = this.props
    
    return (
      <Pane>
        {this.renderAuthAlert()}
        <Pane display="flex" marginTop={majorScale(3)}>  
          <Pane flexGrow={1} display="flex" alignItems="center">
            <ConnectorMark markUrl={mark_url} size={majorScale(6)} />
            <Pane marginLeft={majorScale(2)}>
              <Pane display="flex">
                <Heading size={700}>
                  {title}
                </Heading>
                <Pane display="flex" flexDirection="column" justifyContent="center" marginLeft={majorScale(3)}>
                  <ConnectionStatusBadge connection={connection} />
                </Pane>
              </Pane>
              <Text color="muted">{subtitle}</Text>
            </Pane>
          </Pane>
          <Pane>
            {actions}
          </Pane>
        </Pane>
        {children}
        <Pane
          marginTop={majorScale(3)}
          display="flex"
          justifyContent="space-between"
        >
          <BackButton
            is={Link}
            to="/"
          >Back to Catalog</BackButton>
          <PoweredBy
            margin={0}
            align="right"
            removeBranding={removeBranding}
            campaign="catalog_detail_footer"
          />
        </Pane>
      </Pane>
    )
  }
}

export default withXkit(ConnectorDetail)
