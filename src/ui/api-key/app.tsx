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
import { Authorizer } from '@xkit-co/xkit.js/lib/api/authorization'
import { toaster } from '../toaster'
import Markdown from '../markdown'
import APIKeyForm from './form'
import AuthorizationTitle from './authorization-title'
import VideoLink from './video-link'

export interface APIKeyAppOptions {
  authorization: Authorization,
  field: {
    label: string,
    description?: string,
    placeholder?: string
  },
  onComplete: Function
}

interface AppProps extends APIKeyAppOptions {
  xkit: XkitJs
}

class App extends React.Component<AppProps> {
  render () {
    const {
      authorization,
      field,
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
          <Pane width="100%" maxWidth={majorScale(60)}>
            <Card
              marginTop={majorScale(6)}
              marginBottom={majorScale(4)}
              padding={majorScale(4)}
              elevation={1}
              width="100%"
              background="base"
            >
              <AuthorizationTitle authorization={authorization} />
              <Markdown marginBottom={majorScale(3)}>{`
1. Visit the [Settings Page](https://linear.app/settings/api) in Linear
2. Click "Create Key", and name it "blah key"
3. Copy the key, and paste it in the field below
              `}</Markdown>
              <APIKeyForm {...field} authorization={authorization} onComplete={onComplete} />
              <VideoLink videoUrl="https://xkit-assets.s3-us-west-2.amazonaws.com/Website/Videos/Asana/Asana-1-Xkit.m4v" />
            </Card>
          </Pane>
        </Pane>
      </AppWrapper>
    )
  }
}

export default App
