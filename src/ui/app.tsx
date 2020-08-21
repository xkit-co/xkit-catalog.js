import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  majorScale
} from 'evergreen-ui'
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
import { toaster } from './toaster'
import {
  theme,
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
  title?: string,
  inheritRouter?: boolean,
  rootPath?: string,
  routerType?: routerType,
  history?: History
}

interface AppProps extends AppOptions {
  xkit: XkitJs
}

interface AppState {
  xkit: XkitJs,
  history: History,
  unsubscribe?: Function
}

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    rootPath: '/',
    routerType: 'browser'
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
      xkit: props.xkit,
      history: this.createHistory()
    }

    if (this.props.inheritRouter && this.props.history) {
      console.warn('You set `inheritRouter` to true and passed a `history` object to the Xkit catalog. These are incompatible, `history` will be ignored.')
    }
  }

  componentDidMount (): void {
    const { xkit } = this.props
    if (!xkit) {
      console.error('Xkit was not passed to the React App, it will fail to load.')
    }
    const unsubscribe = xkit.onUpdate(() => {
      // need a fresh object to trigger the update with React context since it compares
      // object references
      this.setState({ xkit: Object.assign({}, xkit) })
    })
  }

  componentWillUnmount (): void {
    const { unsubscribe } = this.state
    if (unsubscribe) {
      unsubscribe()
    }
  }
 
  renderApp () {
    const {
      title,
      hideTitle
    } = this.props
    const {
      xkit
    } = this.state

    return (
      <XkitProvider value={xkit}>
        <Route path="/" strict={true}>
          <ThemeProvider value={theme}>
            <Pane margin="auto">
              <Home title={title} hideTitle={hideTitle} />
            </Pane>
          </ThemeProvider>
        </Route>
      </XkitProvider>
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
