import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  majorScale
} from '@treygriffith/evergreen-ui'
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
import { CatalogThemeProps } from './theme'
import Home from './home'
import { XkitJs } from '@xkit-co/xkit.js'
import AppWrapper from './app-wrapper'

type routerType = 'browser' | 'hash' | 'memory'

export function isRouterType (type: string | undefined): type is routerType {
  return ['memory', 'hash', 'browser'].includes(type)
}

export function createHistory(type: routerType, basename: string): History {
  if (type === 'memory') {
    return createMemoryHistory()
  }

  if (type === 'hash') {
    return createHashHistory({ basename })
  }

  return createBrowserHistory({ basename })
}

export interface AppOptions {
  hideTitle?: boolean,
  hideSearch?: boolean,
  title?: string,
  inheritRouter?: boolean,
  rootPath?: string,
  routerType?: routerType,
  history?: History,
  theme?: CatalogThemeProps
}

interface AppProps extends AppOptions {
  xkit: XkitJs
}

interface AppState {
  history: History,
}

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    rootPath: '/',
    routerType: 'browser',
    theme: {}
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
      console.error('Xkit was not passed to the React App, it will fail to load.')
    }

    if (this.props.inheritRouter && this.props.history) {
      console.warn('You set `inheritRouter` to true and passed a `history` object to the Xkit catalog. These are incompatible, `history` will be ignored.')
    }
  }

  renderApp () {
    const {
      title,
      hideTitle,
      hideSearch,
      xkit,
      theme
    } = this.props

    return (
      <AppWrapper xkit={xkit} theme={theme}>
        <Route path="/" strict={true}>
          <Pane margin="auto">
            <Home title={title} hideTitle={hideTitle} hideSearch={hideSearch} />
          </Pane>
        </Route>
      </AppWrapper>
    )
  }

  render () {
    const {
      routerType,
      rootPath,
      inheritRouter,
      history
    } = this.props

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
