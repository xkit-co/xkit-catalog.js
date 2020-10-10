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
import { Authorization } from '@xkit-co/xkit.js/lib/api/authorization'
import { toaster } from '../toaster'
import Form from './form'
import AuthorizationTitle from './authorization-title'
import Instructions from './instructions'
import VideoLink from './video-link'

export interface AppOptions {
  authorization: Authorization,
  onComplete: Function
}

interface AppProps extends AppOptions {
  xkit: XkitJs
}

class App extends React.Component<AppProps> {
  render () {
    const {
      authorization,
      onComplete
    } = this.props

    const {
      collect_video_url,
      collect_instructions
    } = authorization.authorizer.prototype

    return (
      <AppWrapper xkit={this.props.xkit}>
        <Pane
          padding={majorScale(4)}
          minHeight="100%"
          width="100%"
          display="flex"
          justifyContent="center"
          background="tint1"
          position="absolute"
        >
          <Pane width="100%" maxWidth={majorScale(60)}>
            <Card
              marginTop={majorScale(4)}
              marginBottom={majorScale(4)}
              padding={majorScale(4)}
              elevation={1}
              width="100%"
              background="base"
            >
              <AuthorizationTitle authorization={authorization} />
              <Instructions text={collect_instructions} />
              <Form authorization={authorization} onComplete={onComplete} />
              <VideoLink videoUrl={collect_video_url} />
            </Card>
          </Pane>
        </Pane>
      </AppWrapper>
    )
  }
}

export default App
