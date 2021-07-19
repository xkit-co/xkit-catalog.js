import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  domReady,
  sendToOpener,
  listenToOpener,
  hasOwnProperty 
} from './util'
import { Styled } from './ui/scope-styles'
import PoweredBy from './ui/powered-by'
import {
  Pane,
  Spinner,
  Heading
} from '@treygriffith/evergreen-ui'

const renderLoading = (id: string, title: string, removeBranding: boolean, openerOrigin: string, validOrigins: string[]): void => {
  domReady(window.document, () => {
    ReactDOM.render(
      (
        <Styled>
          <Pane
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            minHeight='100%'
            width='100%'
            position='absolute'
          >
            <Spinner />
            <Heading marginTop='default'>{title ? `Connecting to ${title}` : 'Connecting'}...</Heading>
            <Pane
              position='absolute'
              bottom={0}
            >
              <PoweredBy removeBranding={removeBranding} campaign='loading_popup' />
            </Pane>
          </Pane>
        </Styled>
      ),
      document.getElementById(id)
    )
  })

  listenToOpener((data: unknown) => {
    if (typeof data === 'object' && data !== null && hasOwnProperty(data, 'location')) {
      const location = data.location
      if (typeof location === 'string') {
        window.location.replace(location)
      }
    }
  }, openerOrigin, validOrigins)

  sendToOpener('authWindow:ready', openerOrigin, validOrigins)
}

// TODO: please fix following typescript error
// @ts-expect-error
window.renderLoading = renderLoading
