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
import APIKeyForm from './form'
import AuthorizationTitle from './authorization-title'
import Instructions from './instructions'
import VideoLink from './video-link'

export interface APIKeyAppOptions {
  authorization: Authorization,
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

    const {
      api_key_video_url,
      api_key_instructions
    } = authorization.authorizer.prototype

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
              <Instructions text={api_key_instructions} />
              <APIKeyForm authorization={authorization} onComplete={onComplete} />
              <VideoLink videoUrl={api_key_video_url} />
            </Card>
          </Pane>
        </Pane>
      </AppWrapper>
    )
  }
}

export default App
