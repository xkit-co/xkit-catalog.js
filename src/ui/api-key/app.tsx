import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text } from 'evergreen-ui'
import {
  buildTheme,
  ThemeProvider,
  CatalogTheme
} from '../theme'

interface AppState {
  theme: CatalogTheme
}

class App extends React.Component<{}, AppState> {
  constructor (props: {}) {
    super(props)
    this.state = {
      theme: buildTheme({})
    }
  }

  render () {
    const { theme } = this.state
    return (
      <ThemeProvider value={theme}>
        <Text>Hello world!</Text>
      </ThemeProvider>
    )
  }
}

export default App
