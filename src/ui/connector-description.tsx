import * as React from 'react'
import { Connector } from '@xkit-co/xkit.js'
import { Heading } from '@treygriffith/evergreen-ui'
import Markdown from './markdown'

interface ConnectorDescriptionProps {
  connector: Connector
}

const ConnectorDescription: React.FC<ConnectorDescriptionProps> = ({
  connector
}) => {
  if (!connector.description) {
    return <Markdown size='large' text={connector.about} />
  }

  return (
    <>
      <Markdown size='large' text={connector.description} />
      <Heading size={600} marginTop='default'>
        About {connector.name}
      </Heading>
      <Markdown size='medium' text={connector.about} />
    </>
  )
}

export default ConnectorDescription
