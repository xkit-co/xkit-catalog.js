import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import { Styled } from './ui/scope-styles'
import {
  Pane,
  Spinner,
  Heading
} from '@treygriffith/evergreen-ui'

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


  window.addEventListener('message', (event) => {
    var isValidOrigin = event.origin === openerOrigin || validOrigins.indexOf(event.origin) !== -1

    // Electron breaks the connection between event.source and window.opener
    // and we may not have access to the `location` property, so we skip
    // this check and rely on the origin if we're in Electron.
    if (isValidOrigin && (event.source === window.opener || /electron/i.test(navigator.userAgent))) {
      if (event.data.location) {
        window.location.replace(event.data.location)
      }
    }
  })

  if (window.opener && !window.opener.closed) {
    try {
      // Support situations that don't have a location origin.
      if (openerOrigin !== '') {
        window.opener.postMessage('authWindow:ready', openerOrigin)
      } else {
        var idx = validOrigins.indexOf(window.opener.location.origin)
        if (idx !== -1) {
          window.opener.postMessage('authWindow:ready', validOrigins[idx])
        } else {
          console.error(`Could not find origin to notify: ${window.opener.location.origin}`)
        }
      }
    } catch (e) {
      // Brute force the message.
      for (var i = 0; i < validOrigins.length; i++) {
        try {
          window.opener.postMessage('authWindow:ready', validOrigins[i])
        } catch (e) {}
      }
    }
  }
}

// @ts-ignore
window.renderLoading = renderLoading
