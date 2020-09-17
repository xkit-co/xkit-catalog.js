import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Heading,
  majorScale
} from '@treygriffith/evergreen-ui'
import ConnectorMark from '../connector-mark'

interface AuthorizationTitleProps {
  authorization: Authorization
}

class AuthorizationTitle extends React.Component<TitleProps> {
  render () {
    const { authorization } = this.props
    const mark_url = authorization.initiating_connector?.mark_url
    const name = authorization.initiating_connector?.name || authorization.authorizer.prototype.name

    return (
      <Pane flexGrow={1} display="flex" alignItems="center">
        {mark_url ? <ConnectorMark markUrl={mark_url} size={majorScale(6)} /> : ''}
        <Pane marginLeft={majorScale(2)}>
          <Heading size={700}>
            Connect to {name}
          </Heading>
        </Pane>
      </Pane>
    )
  }
}

export default AuthorizationTitle
