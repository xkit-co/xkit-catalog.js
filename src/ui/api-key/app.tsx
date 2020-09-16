import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text } from 'evergreen-ui'
import { XkitJs } from '@xkit-co/xkit.js'
import AppWrapper from '../app-wrapper'

interface AppProps {
  xkit: XkitJs
}

class App extends React.Component<AppProps> {
  render () {
    return (
      <AppWrapper xkit={this.props.xkit}>
        <Text>Hello world!</Text>
      </AppWrapper>
    )
  }
}

export default App
