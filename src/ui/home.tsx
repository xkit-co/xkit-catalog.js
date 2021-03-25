import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom'
import {
  Heading,
  Spinner,
  majorScale
} from '@treygriffith/evergreen-ui'
import { toaster } from './toaster'
import Catalog, { CatalogFilter } from './catalog'
import ConnectorDetailRoute from './connector-detail-route'
import { Platform } from '@xkit-co/xkit.js/lib/api/platform'
import withXkit, { XkitConsumer } from './with-xkit'
import { SettingsUpdate } from './app'

interface HomeProps {
  title?: string,
  hideTitle?: boolean,
  hideSearch?: boolean,
  connectorsPath: string,
  filter: CatalogFilter,
  updateSettings: SettingsUpdate
}

interface HomeState {
  loading: boolean
  platform?: Platform
}

class Home extends React.Component<XkitConsumer<HomeProps>, HomeState> {
  constructor(props: XkitConsumer<HomeProps>) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount(): void {
    this.loadPlatform()
    if (!this.props.hideTitle) {
      document.title = this.title()
    }
  }

  componentDidUpdate(prevProps: XkitConsumer<HomeProps>, prevState: HomeState): void {
    if (prevProps.hideTitle !== this.props.hideTitle) {
      if (!this.props.hideTitle) {
        document.title = this.title()
      }
    }

    if (prevState.platform !== this.state.platform && !this.props.hideTitle) {
      document.title = this.title()
    }

    if (prevProps.xkit !== this.props.xkit) {
      this.loadPlatform()
    }
  }

  async loadPlatform(): Promise<void> {
    const {
      xkit,
      hideTitle
    } = this.props
    this.setState({ loading: true })
    try {
      const platform = await xkit.getPlatform()
      this.setState({ platform })
    } catch (e) {
      toaster.danger(`Error while loading platform: ${e.message}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  title(): string {
    const {
      title
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

  render(): React.ReactElement {
    const {
      title,
      hideTitle,
      hideSearch,
      connectorsPath,
      filter,
      updateSettings
    } = this.props
    const {
      platform,
      loading
    } = this.state

    if (loading) {
      return <Spinner marginX="auto" marginY={150} size={majorScale(6)} />
    }

    const homePaths = connectorsPath === '' ? ['/'] : ['/', connectorsPath]

    return (
      <>
        {hideTitle ? '' : <Heading size={800} marginBottom={majorScale(2)}>{this.title()}</Heading>}
        <Switch>
          <Route path={['/', connectorsPath]} exact={true}>
            <Catalog
              platform={platform}
              showBackButton={!hideTitle}
              hideSearch={hideSearch}
              connectorsPath={connectorsPath}
              filter={filter}
            />
          </Route>
          <Route
            path={`${connectorsPath}/:slug`}
            render={({ match }: RouteComponentProps<{ slug: string }>) => {
              return (
                <ConnectorDetailRoute
                  removeBranding={platform && platform.remove_branding}
                  path={match.path}
                  url={match.url}
                  slug={match.params.slug}
                  updateSettings={updateSettings}
                />
              )
            }}
          />
        </Switch>
      </>
    )
  }
}

export default withXkit(Home)
