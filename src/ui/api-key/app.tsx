import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text } from 'evergreen-ui'
import {
  theme,
  ThemeProvider
} from '../theme'

class App extends React.Component {
  render () {
    return (
      <ThemeProvider value={theme}>
        <Text>Hello world!</Text>
      </ThemeProvider>
    )
  }
}

export default App
