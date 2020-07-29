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
import { ConfigWrapper } from './config-wrapper'
import Home from './home'

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

interface AppProps {
  domain: string,
  hideTitle?: boolean,
  title?: string,
  rootPath?: string,
  routerType?: routerType,
  inheritRouter?: boolean,
  token?: string,
  loginRedirect?: string
}

class App extends React.Component<AppProps, {}> {
  static defaultProps = {
    rootPath: '/',
    routerType: 'browser'
  }

  constructor (props: AppProps) {
    super(props)
    this.state = {}
  }

  componentDidMount (): void {
    if (!this.props.domain) {
      console.warn('Domain was not passed to the React App, it will fail to load.')
    }
  }
 
  renderApp () {
    const {
      domain,
      token,
      loginRedirect,
      title,
      hideTitle
    } = this.props

    return (
      <ConfigWrapper domain={domain} token={token} loginRedirect={loginRedirect}>
        <Route path="/" strict={true}>
          <ThemeProvider value={theme}>
            <Pane margin="auto">
              <Home title={title} hideTitle={hideTitle} />
            </Pane>
          </ThemeProvider>
        </Route>
      </ConfigWrapper>
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
