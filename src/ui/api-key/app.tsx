import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppWrapper from '../app-wrapper'
import {
  Text,
  Button
} from '@treygriffith/evergreen-ui'
import { XkitJs } from '@xkit-co/xkit.js'

interface AppProps {
  xkit: XkitJs
}

interface AppState {
  saving: boolean
}

class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)
    this.state = { saving: false }
  }

  handleSave = async (): Promise<void> => {
    this.setState({ saving: true })
  }

  render () {
    const { saving } = this.state

    return (
      <AppWrapper xkit={this.props.xkit}>
        <form>
          <Button
            appearance="primary"
            isLoading={saving}
            onClick={this.handleSave}
          >
            {saving ? 'Saving' : 'Save'}
          </Button>
        </form>
      </AppWrapper>
    )
  }
}

export default App
