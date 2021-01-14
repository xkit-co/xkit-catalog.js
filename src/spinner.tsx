import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  domReady,
  sendToOpener,
  listenToOpener
} from './util'
import { Styled } from './ui/scope-styles'
import {
  Pane,
  Spinner,
  Heading
} from '@treygriffith/evergreen-ui'
import { hasOwnProperty } from '@xkit-co/xkit.js/lib/util'

const renderLoading = (id: string, title: string, openerOrigin: string, validOrigins: string[]) => {
  domReady(window.document, () => {
    ReactDOM.render(
      (
        <Styled>
          <Pane
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100%"
            width="100%"
            position="absolute"
          >
            <Spinner />
            <Heading marginTop="default">{title ? `Connecting to ${title}` : 'Connecting'}...</Heading>
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

// @ts-ignore
window.renderLoading = renderLoading
