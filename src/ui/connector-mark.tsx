import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ConnectorMarkProps {
  markUrl: string,
  size: number
}

class ConnectorMark extends React.Component<ConnectorMarkProps, {}> {
  render (): React.ReactElement {
    const { markUrl, size } = this.props
    return (
      <img src={markUrl} height={size} width={size} style={{borderRadius: '5px'}} />
    )
  }
}

export default ConnectorMark
