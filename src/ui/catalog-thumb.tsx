import * as React from 'react'
import {
  Card,
  Heading,
  Paragraph,
  Pane,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js'
import { Link } from 'react-router-dom'
import ConnectionStatusBadge from './connection-status-badge'
import ConnectorMark from './connector-mark'
import { ThemeConsumer, withTheme } from './theme'

interface CatalogThumbProps {
  connector: Connector
  connectorsPath: string
}

class CatalogThumb extends React.Component<ThemeConsumer<CatalogThumbProps>> {
  render(): React.ReactElement {
    const {
      connectorsPath,
      connector: {
        name,
        slug,
        short_description: shortDescription,
        mark_url: markUrl,
        connections
      },
      theme
    } = this.props

    return (
      <Card
        background='base'
        elevation={theme.card.elevation}
        hoverElevation={theme.card.hoverElevation}
        borderRadius={theme.card.borderRadius}
        marginRight={majorScale(3)}
        marginBottom={majorScale(3)}
        width={250}
        minHeight={150}
        display='flex'
        flexDirection='column'
        padding={theme.card.padding}
        is={Link}
        textDecoration='none'
        to={`${connectorsPath}/${slug}`}
      >
        <Pane display='flex'>
          <Pane flexGrow={1}>
            <ConnectorMark markUrl={markUrl} size={majorScale(5)} />
          </Pane>
          <ConnectionStatusBadge useTooltip connections={connections || []} />
        </Pane>
        <Heading size={600} marginTop={majorScale(2)}>
          {name}
        </Heading>
        <Paragraph size={300} marginTop={majorScale(1)}>
          {shortDescription}
        </Paragraph>
      </Card>
    )
  }
}

export default withTheme(CatalogThumb)
