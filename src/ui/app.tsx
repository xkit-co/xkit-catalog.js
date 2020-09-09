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
import { toaster } from './toaster'
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
  xkit: XkitJs,
  history: History,
  unsubscribe?: Function,
  cssTag?: HTMLElement,
  theme: CatalogTheme
}

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    rootPath: '/',
    routerType: 'browser',
    theme: {}
  }

  ref: React.RefObject<HTMLDivElement>

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
      history: this.createHistory(),
      theme: buildTheme(this.props.theme)
    }

    if (this.props.inheritRouter && this.props.history) {
      console.warn('You set `inheritRouter` to true and passed a `history` object to the Xkit catalog. These are incompatible, `history` will be ignored.')
    }

    this.ref = React.createRef<HTMLDivElement>()
  }

  private moveToaster (toEl: HTMLElement): void {
    const toasterEl = window.document.querySelector('[data-evergreen-toaster-container]')
    if (!toasterEl) {
      console.error('xkit: Cannot move notification toaster as it does not exist')
      return
    }
    if (!toEl) {
      console.error('xkit: Cannot move notification toaster as its container does not exist')
      return
    }
    toEl.appendChild(toasterEl)
  }

  moveToasterToApp (): void {
    // Need to move the toaster inside our element so we can style it
    this.moveToaster(this.ref.current)
  }

  moveToasterToBody (): void {
    // Move the toaster back to the body so it is not destroyed on unmount
    this.moveToaster(window.document.body)
  }

  componentDidMount (): void {
    this.moveToasterToApp()
    const { xkit } = this.props
    if (!xkit) {
      console.error('Xkit was not passed to the React App, it will fail to load.')
    }
    const unsubscribe = xkit.onUpdate(() => {
      // need a fresh object to trigger the update with React context since it compares
      // object references
      this.setState({ xkit: Object.assign({}, xkit) })
    })
    this.setState({ cssTag: injectCSS(window.document, resetStyles) })
  }

  componentWillUnmount (): void {
    this.moveToasterToBody()
    const { unsubscribe } = this.state
    if (unsubscribe) {
      unsubscribe()
    }
    if (this.state.cssTag) {
      removeCSS(window.document, this.state.cssTag)
    }
  }
 
  renderApp () {
    const {
      title,
      hideTitle,
      hideSearch
    } = this.props
    const {
      xkit,
      theme
    } = this.state

    return (
      <div id={SCOPE_ID} ref={this.ref}>
        <XkitProvider value={xkit}>
          <Route path="/" strict={true}>
            <ThemeProvider value={theme}>
              <Pane margin="auto">
                <Home title={title} hideTitle={hideTitle} hideSearch={hideSearch} />
              </Pane>
            </ThemeProvider>
          </Route>
        </XkitProvider>
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
