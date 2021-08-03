import * as React from 'react'

interface ConnectorMarkProps {
  markUrl: string
  size: number
  style?: React.CSSProperties
}

class ConnectorMark extends React.Component<ConnectorMarkProps, {}> {
  style(): React.CSSProperties {
    const overrideStyle = this.props.style || {}
    return Object.assign({ borderRadius: '5px' }, overrideStyle)
  }

  render(): React.ReactElement {
    const { markUrl, size } = this.props
    return <img src={markUrl} height={size} width={size} style={this.style()} />
  }
}

export default ConnectorMark
