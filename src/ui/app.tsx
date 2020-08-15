import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  majorScale
} from 'evergreen-ui'
import {
  Route,
  BrowserRouter,
  HashRouter,
  MemoryRouter
} from 'react-router-dom'
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

interface RouterProps {
  type: routerType,
  basename: string
}

const Router: React.FC<RouterProps> = ({ type, basename, children }) => {
  if (type === 'memory') {
    return (
      <MemoryRouter>{children}</MemoryRouter>
    )
  }

  if (type === 'browser') {
    return (
      <BrowserRouter basename={basename}>{children}</BrowserRouter>
    )
  }

  return (
    <HashRouter basename={basename}>{children}</HashRouter>
  )
}

export interface AppOptions {
  hideTitle?: boolean,
  title?: string,
  rootPath?: string,
  routerType?: routerType,
  inheritRouter?: boolean
}

interface AppProps extends AppOptions {
  xkit: XkitJs
}

interface AppState {
  xkit: XkitJs,
  unsubscribe?: Function
}

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    rootPath: '/',
    routerType: 'browser'
  }

  constructor (props: AppProps) {
    super(props)
    this.state = {
      xkit: props.xkit
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
    const { routerType, rootPath, inheritRouter } = this.props

    if (inheritRouter) {
      return this.renderApp()
    }

    return (
      <Router basename={rootPath} type={routerType}>
        {this.renderApp()}
      </Router>
    )
  }
}

export default App
