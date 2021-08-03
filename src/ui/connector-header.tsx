import * as React from 'react'
import { Pane, majorScale, Heading, Text } from '@treygriffith/evergreen-ui'
import ConnectorMark from './connector-mark'

interface ConnectorHeaderProps {
  mark_url: string
  title: string
  subtitle: string
}

const ConnectorHeader: React.FC<ConnectorHeaderProps> = ({
  mark_url: markUrl,
  title,
  subtitle,
  children
}) => {
  return (
    <Pane display='flex' alignItems='center'>
      <ConnectorMark markUrl={markUrl} size={majorScale(6)} />
      <Pane marginLeft={majorScale(2)}>
        <Pane display='flex'>
          <Heading size={700}>{title}</Heading>
          <Pane
            display='flex'
            flexDirection='column'
            justifyContent='center'
            marginLeft={majorScale(3)}
          >
            {children}
          </Pane>
        </Pane>
        <Text color='muted'>{subtitle}</Text>
      </Pane>
    </Pane>
  )
}

export default ConnectorHeader
