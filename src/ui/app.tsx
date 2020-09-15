import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { injectCSS, removeCSS } from '../util'
import { SCOPE_ID } from './scope-styles'
import resetStyles from './reset.css'
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
import { Toaster } from './toaster'
import {
  buildTheme,
  CatalogThemeProps,
  CatalogTheme,
  ThemeProvider
} from './theme'
import { Provider as XkitProvider } from './xkit-context'
import Home from './home'
import { XkitJs } from '@xkit-co/xkit.js'

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
  cssTag?: HTMLElement,
  theme: CatalogTheme
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
      history: this.createHistory(),
      theme: buildTheme(this.props.theme)
    }

    if (this.props.inheritRouter && this.props.history) {
      console.warn('You set `inheritRouter` to true and passed a `history` object to the Xkit catalog. These are incompatible, `history` will be ignored.')
    }
  }

  componentDidMount (): void {
    this.setState({ cssTag: injectCSS(window.document, resetStyles) })
  }

  componentWillUnmount (): void {
    if (this.state.cssTag) {
      removeCSS(window.document, this.state.cssTag)
    }
  }
 
  renderApp () {
    const {
      title,
      hideTitle,
      hideSearch,
      xkit
    } = this.props
    const {
      theme
    } = this.state

    return (
      <div id={SCOPE_ID}>
        <Toaster>
          <XkitProvider value={xkit}>
            <Route path="/" strict={true}>
              <ThemeProvider value={theme}>
                <Pane margin="auto">
                  <Home title={title} hideTitle={hideTitle} hideSearch={hideSearch} />
                </Pane>
              </ThemeProvider>
            </Route>
          </XkitProvider>
        </Toaster>
      </div>
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
