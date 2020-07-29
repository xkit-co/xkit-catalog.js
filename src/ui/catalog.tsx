import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Card,
  Heading,
  InboxIcon,
  SearchInput,
  BackButton,
  Spinner,
  Colors,
  majorScale
} from 'evergreen-ui'
import { compareTwoStrings } from 'string-similarity'
import CatalogThumb from './catalog-thumb'
import { IKitConfig } from '@xkit-co/xkit.js/lib/config'
import {
  listConnectors,
  Connector
} from '@xkit-co/xkit.js/lib/api/connector'
import {
  getPlatform,
  Platform
} from '@xkit-co/xkit.js/lib/api/platform'
import { toaster } from './toaster'
import {
  ConfigConsumer,
  withConfig
} from './config-wrapper'
import { theme } from './theme'

interface CatalogProps {
  platform: Platform,
  hideBackButton?: boolean
}

interface CatalogState {
  connectors: Connector[]
  loading: boolean,
  search: string
}

const SIMILARITY_MIN = 0.75

class Catalog extends React.Component<ConfigConsumer<CatalogProps>, CatalogState> {
  constructor (props: ConfigConsumer<CatalogProps>) {
    super(props)
    this.state = {
      connectors: [],
      loading: true,
      search: ""
    }
  }

  componentDidMount () {
    this.loadConnectors()
  }

  async loadConnectors (): Promise<void> {
    this.setState({ loading: true })
    try {
      const connectors = await this.props.callWithConfig(config => listConnectors(config))
      this.setState({ connectors })
    } catch (e) {
      toaster.danger(`Error while loading connectors: ${e.message}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  renderBackButton () {
    const { platform, hideBackButton } = this.props
    if (!platform || !platform.website || hideBackButton) return

    return (
      <Pane marginTop={majorScale(3)}>
        <BackButton is="a" href={platform.website}>Back to {platform.name}</BackButton>
      </Pane>
    )
  }

  renderConnectors () {
    const { connectors, loading, search } = this.state
    if (loading) {
      return (
        <EmptyCatalog>
          <Spinner margin="auto" />
        </EmptyCatalog>
      )
    }

    const filteredConnectors = connectors.filter(connector => {
      if (!search.length) {
        return true
      }
      return connector.name.toLowerCase().includes(search.toLowerCase()) ||
             (compareTwoStrings(connector.name.toLowerCase(), search.toLowerCase()) > SIMILARITY_MIN)
    })

    if (!filteredConnectors.length) {
      return (
        <EmptyCatalog background="tint1">
          <Heading size={600} textAlign="center">
            <InboxIcon marginRight={majorScale(1)} />
            No Integrations Found
          </Heading>
        </EmptyCatalog>
      )
    }

    return filteredConnectors.map(connector => {
      return (
        <CatalogThumb
          connector={connector}
          key={connector.slug}
        />
      )
    })
  }

  render () {
    const { search } = this.state
    return (
      <Pane>
        <SearchInput
          marginTop={majorScale(2)}
          placeholder="Search integrations..."
          height={majorScale(6)}
          width="100%"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ search: e.target.value })}
          value={search}
        />
        <Pane
          clearfix
          marginTop={majorScale(3)}
          display="flex"
          flexWrap="wrap"
          marginRight={majorScale(-3)}
          marginBottom={majorScale(-3)}
        >
          {this.renderConnectors()}
        </Pane>
        {this.renderBackButton()}
      </Pane>
    )
  }
}

interface EmptyCatalogProps {
  background?: keyof Colors['background']
}

const EmptyCatalog: React.FC<EmptyCatalogProps> = ({ background, children }): React.ReactElement => {
  return (
    <Card
      flexGrow={1}
      marginRight={majorScale(3)}
      marginBottom={majorScale(3)}
      background={background}
      padding={majorScale(2)}
      height={150}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {children}
    </Card>
  )
}

export default withConfig(Catalog)
