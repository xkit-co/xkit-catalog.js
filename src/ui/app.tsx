import * as React from 'react'
import { logger } from '../util'
import AppWrapper from './app-wrapper'
import { Pane } from '@treygriffith/evergreen-ui'
import {
  Route,
  Router
} from 'react-router-dom'
import {
  createBrowserHistory,
  createMemoryHistory,
  createHashHistory,
  History
} from 'history'
import { CatalogFilter } from './catalog'
import { CatalogThemeProps } from './theme'
import Home from './home'
import { SettingsField } from './settings-form'
import { XkitJs } from '@xkit-co/xkit.js'
import { Connection } from '@xkit-co/xkit.js/lib/api/connection'

type routerType = 'browser' | 'hash' | 'memory'

export function isRouterType (type: string | undefined): type is routerType {
  return ['memory', 'hash', 'browser'].includes(type)
}

export function createHistory (type: routerType, basename: string): History {
  if (type === 'memory') {
    return createMemoryHistory()
  }

  if (type === 'hash') {
    return createHashHistory({ basename })
  }

  return createBrowserHistory({ basename })
}

export type SettingsUpdate = (connection: Connection, fields?: SettingsField[]) => SettingsField[] | Promise<SettingsField[]>

export interface AppOptions {
  hideTitle?: boolean
  hideSearch?: boolean
  title?: string
  inheritRouter?: boolean
  rootPath?: string
  routerType?: routerType
  history?: History
  theme?: CatalogThemeProps
  connectorsPath?: string
  filter?: CatalogFilter
  settings?: SettingsUpdate
}

interface AppProps extends AppOptions {
  xkit: XkitJs
}

interface AppState {
  history: History
}

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    rootPath: '/',
    connectorsPath: '/connectors',
    routerType: 'browser',
    theme: {},
    filter: () => true,
    settings: (): SettingsField[] => []
  }

  createHistory (): History {
    if (this.props.history) {
      return this.props.history
    }
    return createHistory(this.props.routerType, this.props.rootPath)
  }

  constructor (props: AppProps) {
    super(props)
    this.state = {
      history: this.createHistory()
    }

    if (!this.props.xkit) {
      logger.error('An Xkit instance was not passed to the React App, it will fail to load.')
    }

    if (this.props.inheritRouter && this.props.history) {
      logger.warn('You set `inheritRouter` to true and passed a `history` object to the Xkit catalog. These are incompatible, `history` will be ignored.')
    }
  }

  renderApp () {
    const {
      title,
      hideTitle,
      hideSearch,
      connectorsPath,
      filter,
      settings,
      xkit,
      theme
    } = this.props

    return (
      <AppWrapper xkit={xkit} theme={theme}>
        <Route path='/' strict>
          <Pane margin='auto'>
            <Home
              title={title}
              hideTitle={hideTitle}
              hideSearch={hideSearch}
              connectorsPath={connectorsPath === '/' ? '' : connectorsPath}
              filter={filter}
              updateSettings={settings}
            />
          </Pane>
        </Route>
      </AppWrapper>
    )
  }

  render () {
    const {
      inheritRouter
    } = this.props
    const { history } = this.state

    if (inheritRouter) {
      return this.renderApp()
    }

    return (
      <Router history={history}>
        {this.renderApp()}
      </Router>
    )
  }
}

export default App
