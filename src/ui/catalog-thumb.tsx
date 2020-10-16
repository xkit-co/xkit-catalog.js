import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Card,
  Heading,
  Button,
  Paragraph,
  Pane,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Connector } from '@xkit-co/xkit.js/lib/api/connector'
import { Link } from 'react-router-dom'
import ConnectionStatus from './connection-status'
import ConnectorMark from './connector-mark'
import { ThemeConsumer, withTheme } from './theme'

interface CatalogThumbProps {
  connector: Connector
}

class CatalogThumb extends React.Component<ThemeConsumer<CatalogThumbProps>> {
  render () {
    const {
      connector: {
        name,
        slug,
        short_description,
        mark_url,
        connection
      },
      theme
    } = this.props

    return (
      <Card
        background="base"
        elevation={theme.card.elevation}
        hoverElevation={theme.card.hoverElevation}
        borderRadius={theme.card.borderRadius}
        marginRight={majorScale(3)}
        marginBottom={majorScale(3)}
        width={250}
        minHeight={150}
        display="flex"
        flexDirection="column"
        padding={theme.card.padding}
        is={Link}
        textDecoration="none"
        to={`/connectors/${slug}`}
      >
        <Pane display="flex">
          <Pane flexGrow={1}>
            <ConnectorMark markUrl={mark_url} size={majorScale(5)} />
          </Pane>
          <ConnectionStatus useTooltip={true} connection={connection} />
        </Pane>
        <Heading size={600} marginTop={majorScale(2)}>{name}</Heading>
        <Paragraph size={300} marginTop={majorScale(1)}>
          {short_description}
        </Paragraph>
      </Card>
    )
  }
}

export default withTheme(CatalogThumb)
