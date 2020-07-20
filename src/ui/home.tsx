import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  withConfig,
  ConfigConsumer,
  callWithConfig
} from './config-wrapper'
import {
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom'
import {
  Heading,
  Spinner,
  majorScale
} from 'evergreen-ui'
import { toaster } from './toaster'
import Catalog from './catalog'
import ConnectorDetailRoute from './connector-detail-route'
import {
  Platform,
  getPlatform
} from '@xkit-co/xkit.js/lib/api/platform'

interface HomeProps {
  title?: string,
  hideTitle?: boolean
}

interface HomeState {
  loading: boolean
  platform?: Platform
}

class Home extends React.Component<ConfigConsumer<HomeProps>, HomeState> {
  constructor (props: ConfigConsumer<HomeProps>) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount (): void {
    if (this.props.config && this.props.config.domain) {
      this.loadPlatform()
    }
    if (!this.props.hideTitle) {
      document.title = this.title()
    }
  }

  componentDidUpdate (prevProps: ConfigConsumer<HomeProps>): void {
    if ((!prevProps.config || !prevProps.config.domain) && (this.props.config && this.props.config.domain)) {
      this.loadPlatform()
    }
    if (prevProps.hideTitle !== this.props.hideTitle) {
      if (!this.props.hideTitle) {
        document.title = this.title()
      }
    }
  }

  async loadPlatform (): Promise<void> {
    this.setState({ loading: true })
    try {
      const platform = await callWithConfig(getPlatform)
      this.setState({ platform })
      if (!this.props.hideTitle) {
        document.title = this.title()
      }
    } catch (e) {
      toaster.danger(`Error while loading platform: ${e.message}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  title (): string {
    const {
      title,
      configLoading,
    } = this.props
    const {
      platform,
      loading
    } = this.state

    if (title) {
      return title
    }

    if (platform) {
      return `${platform.name} Integrations`
    }

    return 'Loading...'
  }

  render (): React.ReactElement {
    const {
      title,
      hideTitle,
      config,
      configLoading
    } = this.props
    const {
      platform,
      loading
    } = this.state

    if (loading || configLoading) {
      return <Spinner marginX="auto"  marginY={150} size={majorScale(6)} />
    }

    return (
      <>
        {hideTitle ? '' : <Heading size={800} marginBottom={majorScale(2)}>{this.title()}</Heading>}
        <Switch>
          <Route path={['/', '/connectors']} exact={true}>
            <Catalog
              platform={platform}
            />
          </Route>
          <Route
            path="/connectors/:slug"
            render={({ match }: RouteComponentProps<{slug: string}>) => {
              return (
                <ConnectorDetailRoute
                  url={match.url}
                  slug={match.params.slug}
                />
              )
            }}
          />
        </Switch>
      </>
    )
  }
}

export default withConfig(Home)
