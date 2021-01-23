import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Connection } from '@xkit-co/xkit.js/lib/api/connection'
import { Link } from 'react-router-dom'
import {
  Pane,
  Heading,
  Button,
  AddIcon,
  TrashIcon,
  CogIcon,
  majorScale,
  minorScale
} from '@treygriffith/evergreen-ui'
import ConnectorDetail from './connector-detail'
import Markdown from './markdown'
import { friendlyMessage } from './errors'
import { toaster } from './toaster'
import withXkit, { XkitConsumer } from './with-xkit'

interface InstallProps {
  removeBranding: boolean,
  connector: Connector,
  updateConnection: (connection: Connection) => void,
  connection?: Connection,
  showSettings: boolean,
  url: string
}

interface InstallState {
  loading: boolean
}

class Install extends React.Component<XkitConsumer<InstallProps>, InstallState> {
  constructor (props: XkitConsumer<InstallProps>) {
    super(props)
    this.state = {
      loading: false
    }
  }

  handleError = (error: Error): void => {
    toaster.danger(friendlyMessage(error.message))
  }

  handleInstall = async (): Promise<void> => {
    const {
      connector,
      xkit,
      updateConnection
    } = this.props
    try {
      this.setState({ loading: true })
      const connection = await xkit.connect(connector)
      updateConnection(connection)
      toaster.success(`Installed ${connector.name}`)
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleRemove = async (): Promise<void> => {
    const {
      xkit,
      connector: {
        slug,
        name
      },
      updateConnection
    } = this.props
    try {
      this.setState({ loading: true })
      await xkit.removeConnection({ slug })
      updateConnection(undefined)
      toaster.success(`Removed ${name}`)
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  renderActions () {
    const {
      connection,
      showSettings,
      url
    } = this.props
    const { loading } = this.state

    if (!connection || !connection.enabled) {
      return (
        <Button
          iconBefore={loading ? null : AddIcon}
          appearance="primary"
          marginTop={minorScale(1)}
          height={majorScale(5)}
          isLoading={loading}
          onClick={this.handleInstall}
        >
          Install
        </Button>
      )
    }


    return (
      <>
        <Button
          iconBefore={loading ? null : TrashIcon}
          marginLeft={majorScale(1)}
          marginTop={minorScale(1)}
          height={majorScale(5)}
          isLoading={loading}
          onClick={this.handleRemove}
        >
          Remove
        </Button>
        {showSettings &&
          <Button
            iconBefore={CogIcon}
            marginLeft={majorScale(1)}
            marginTop={minorScale(1)}
            height={majorScale(5)}
            is={Link}
            to={`${url}/settings`}
          >
            Configure
          </Button>
        }
      </>
    )
  }

  renderDescription () {
    const { connector } = this.props

    if (!connector.description) {
      return <Markdown size="large" text={connector.about} />
    }

    return (
      <>
        <Markdown size="large" text={connector.description} />
        <Heading size={600} marginTop="default">
          About {connector.name}
        </Heading>
        <Markdown size="medium" text={connector.about} />
      </>
    )
  }

  render () {
    const {
      removeBranding,
      connector,
      connection,
      updateConnection
    } = this.props

    return (
      <ConnectorDetail
        updateConnection={updateConnection}
        removeBranding={removeBranding}
        connection={connection}
        connector={connector}
        title={connector.name}
        subtitle={connector.short_description}
        actions={this.renderActions()}
      >
        {this.renderDescription()}
      </ConnectorDetail>
    )
  }
}

export default withXkit(Install)
