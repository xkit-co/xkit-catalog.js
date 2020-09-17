import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppWrapper from '../app-wrapper'
import {
  Card,
  Pane,
  Heading,
  majorScale
} from '@treygriffith/evergreen-ui'
import { XkitJs } from '@xkit-co/xkit.js'
import { toaster } from '../toaster'
import APIKeyForm from './form'

export interface APIKeyAppOptions {
  name: string,
  field: {
    label: string,
    description: string,
    placeholder?: string
  },
  slug: string,
  state: string,
  onComplete: Function
}

interface AppProps extends APIKeyAppOptions {
  xkit: XkitJs
}

class App extends React.Component<AppProps> {
  render () {
    const {
      name,
      field,
      slug,
      state,
      onComplete
    } = this.props

    return (
      <AppWrapper xkit={this.props.xkit}>
        <Pane
          padding={majorScale(4)}
          height="100%"
          width="100%"
          display="flex"
          justifyContent="center"
          background="tint1"
          position="absolute"
        >
          <Pane width="100%">
            <Heading size={600}>
              Connect to {name}
            </Heading>
            <Card
              marginTop={majorScale(2)}
              padding={majorScale(3)}
              elevation={1}
              width="100%"
              background="base"
            >
              <APIKeyForm {...field} slug={slug} state={state} onComplete={onComplete} />
            </Card>
          </Pane>
        </Pane>
      </AppWrapper>
    )
  }
}

export default App
