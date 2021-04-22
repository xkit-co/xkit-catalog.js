import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  PaneProps,
  Heading,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Authorization } from '@xkit-co/xkit.js/lib/api/authorization'
import ConnectorMark from '../connector-mark'

interface AuthorizationMarkProps {
  markUrl?: string
}

class AuthorizationMark extends React.Component<AuthorizationMarkProps> {
  render () {
    if (!this.props.markUrl) {
      return null
    }

    return (
      <Pane
        border='default'
        borderRadius='100%'
        borderTopColor='transparent'
        borderLeftColor='transparent'
        padding={majorScale(2)}
        background='tint1'
        position='absolute'
        top={-1 * majorScale(9)}
        display='flex'
        justifyContent='center'
        style={{ transform: 'rotate(45deg)' }}
      >
        <ConnectorMark
          markUrl={this.props.markUrl}
          size={majorScale(6)}
          style={{ transform: 'rotate(-45deg)' }}
        />
      </Pane>
    )
  }
}

interface AuthorizationTitleProps {
  authorization: Authorization
}

class AuthorizationTitle extends React.Component<AuthorizationTitleProps> {
  render () {
    const { authorization } = this.props
    const mark_url = authorization.initiating_connector?.mark_url
    const name = authorization.initiating_connector?.name || authorization.authorizer.prototype.name

    return (
      <Pane
        flexGrow={1}
        display='flex'
        justifyContent='center'
        position='relative'
      >
        <AuthorizationMark markUrl={mark_url} />
        <Heading size={700} marginTop={majorScale(5)} marginBottom={majorScale(4)}>
          Connect to {name}
        </Heading>
      </Pane>
    )
  }
}

export default AuthorizationTitle
