import * as React from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { Heading, Spinner, majorScale } from '@treygriffith/evergreen-ui'
import { toaster } from './toaster'
import Catalog, { CatalogFilter } from './catalog'
import ConnectorDetails from './connector-details'
import { Platform } from '@xkit-co/xkit.js'
import withXkit, { XkitConsumer } from './with-xkit'
import { SettingsUpdate, LocationListener } from './app'
import { errorMessage } from '../util'

interface HomeProps {
  title?: string
  hideTitle?: boolean
  hideSearch?: boolean
  connectorsPath: string
  filter: CatalogFilter
  updateSettings: SettingsUpdate
  onLocationChange: LocationListener
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
    void this.loadPlatform()
    if (!this.props.hideTitle) {
      document.title = this.title()
    }
  }

  componentDidUpdate(
    prevProps: XkitConsumer<HomeProps>,
    prevState: HomeState
  ): void {
    if (prevProps.hideTitle !== this.props.hideTitle) {
      if (!this.props.hideTitle) {
        document.title = this.title()
      }
    }

    if (prevState.platform !== this.state.platform && !this.props.hideTitle) {
      document.title = this.title()
    }

    if (prevProps.xkit !== this.props.xkit) {
      void this.loadPlatform()
    }
  }

  async loadPlatform(): Promise<void> {
    const { xkit } = this.props
    this.setState({ loading: true })
    try {
      const platform = await xkit.getPlatform()
      this.setState({ platform })
    } catch (e) {
      toaster.danger(`Error while loading platform: ${errorMessage(e)}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  title(): string {
    const { title } = this.props
    const { platform } = this.state

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
      hideTitle,
      hideSearch,
      connectorsPath,
      filter,
      updateSettings,
      onLocationChange
    } = this.props
    const { platform, loading } = this.state

    if (loading) {
      return <Spinner marginX='auto' marginY={150} size={majorScale(6)} />
    }

    return (
      <>
        {hideTitle ? (
          ''
        ) : (
          <Heading size={800} marginBottom={majorScale(2)}>
            {this.title()}
          </Heading>
        )}
        <Switch>
          <Route path={['/', connectorsPath]} exact>
            <Catalog
              platform={platform}
              showBackButton={!hideTitle}
              hideSearch={hideSearch}
              connectorsPath={connectorsPath}
              filter={filter}
              onLocationChange={onLocationChange}
            />
          </Route>
          <Route
            path={`${connectorsPath}/:slug`}
            render={({ match }: RouteComponentProps<{ slug: string }>) => {
              return (
                <ConnectorDetails
                  removeBranding={platform?.remove_branding}
                  path={match.path}
                  url={match.url}
                  slug={match.params.slug}
                  settingsUpdate={updateSettings}
                  onLocationChange={onLocationChange}
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
