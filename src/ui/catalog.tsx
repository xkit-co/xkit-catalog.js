import * as React from 'react'
import {
  Pane,
  Text,
  Card,
  Heading,
  InboxIcon,
  SearchInput,
  BackButton,
  Spinner,
  Colors,
  majorScale
} from '@treygriffith/evergreen-ui'
import { compareTwoStrings } from 'string-similarity'
import CatalogThumb from './catalog-thumb'
import { Connector, Platform } from '@xkit-co/xkit.js'
import { toaster } from './toaster'
import withXkit, { XkitConsumer } from './with-xkit'
import PoweredBy from './powered-by'
import { LocationListener } from './app'
import { errorMessage } from '../util'

export type CatalogFilter = (connector: Connector) => boolean

interface CatalogProps {
  platform: Platform
  showBackButton?: boolean
  hideSearch?: boolean
  connectorsPath: string
  filter: CatalogFilter
  onLocationChange: LocationListener
}

interface CatalogState {
  connectors: Connector[]
  loading: boolean
  search: string
}

const SIMILARITY_MIN = 0.75

class Catalog extends React.Component<
  XkitConsumer<CatalogProps>,
  CatalogState
> {
  constructor(props: XkitConsumer<CatalogProps>) {
    super(props)
    this.state = {
      connectors: [],
      loading: true,
      search: ''
    }
  }

  componentDidMount(): void {
    void this.loadConnectors()
    this.props.onLocationChange({ name: 'index' })
  }

  componentDidUpdate(prevProps: XkitConsumer<CatalogProps>): void {
    if (prevProps.xkit !== this.props.xkit) {
      void this.loadConnectors()
    }
  }

  async loadConnectors(): Promise<void> {
    this.setState({ loading: true })
    try {
      const connectors = await this.props.xkit.listConnectors()
      this.setState({ connectors })
    } catch (e) {
      toaster.danger(`Error while loading connectors: ${errorMessage(e)}`)
    } finally {
      this.setState({ loading: false })
    }
  }

  renderBackButton(): React.ReactNode {
    const { platform, showBackButton } = this.props
    const shouldShowBack = platform?.website && showBackButton

    if (!shouldShowBack && platform.remove_branding) return

    return (
      <Pane
        marginTop={majorScale(3)}
        marginBottom={majorScale(3)}
        display='flex'
        justifyContent='space-between'
      >
        {shouldShowBack && (
          <BackButton is='a' href={platform.website}>
            Back to {platform.name}
          </BackButton>
        )}
        <PoweredBy
          margin={0}
          align='right'
          removeBranding={platform.remove_branding}
          campaign='catalog_footer'
        />
      </Pane>
    )
  }

  searchFilter = (connector: Connector): boolean => {
    const { search } = this.state
    if (!search.length) {
      return true
    }
    return (
      connector.name.toLowerCase().includes(search.toLowerCase()) ||
      compareTwoStrings(connector.name.toLowerCase(), search.toLowerCase()) >
        SIMILARITY_MIN
    )
  }

  renderConnectors(): React.ReactNode {
    const { connectorsPath, filter } = this.props
    const { connectors, loading } = this.state
    if (loading) {
      return (
        <EmptyCatalog>
          <Spinner margin='auto' size={majorScale(6)} />
        </EmptyCatalog>
      )
    }

    const filteredConnectors = connectors
      .filter(filter)
      .filter(this.searchFilter)

    if (filteredConnectors.length === 0) {
      return (
        <EmptyCatalog background='tint1'>
          <Heading size={600} textAlign='center'>
            <Text marginRight={majorScale(1)}>
              <InboxIcon />
            </Text>
            No Integrations Found
          </Heading>
        </EmptyCatalog>
      )
    }

    return filteredConnectors.map((connector) => {
      return (
        <CatalogThumb
          connector={connector}
          key={connector.slug}
          connectorsPath={connectorsPath}
        />
      )
    })
  }

  render(): React.ReactElement {
    const { hideSearch } = this.props
    const { search } = this.state
    return (
      <Pane>
        {!hideSearch && (
          <SearchInput
            marginTop={majorScale(2)}
            placeholder='Search integrations...'
            height={majorScale(6)}
            width='100%'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({ search: e.target.value })
            }
            value={search}
          />
        )}
        <Pane
          clearfix
          marginTop={majorScale(3)}
          display='flex'
          flexWrap='wrap'
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

const EmptyCatalog: React.FC<EmptyCatalogProps> = ({
  background,
  children
}): React.ReactElement => {
  return (
    <Card
      flexGrow={1}
      marginRight={majorScale(3)}
      marginBottom={majorScale(3)}
      background={background}
      padding={majorScale(2)}
      height={150}
      display='flex'
      flexDirection='column'
      justifyContent='center'
    >
      {children}
    </Card>
  )
}

export default withXkit(Catalog)
