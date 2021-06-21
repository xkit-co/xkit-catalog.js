import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  domReady,
  sendToOpener
} from './util'
import { Styled } from './ui/scope-styles'
import {
  Pane,
  Heading
} from '@treygriffith/evergreen-ui'

const renderError = (id: string, error: string, openerOrigin: string, validOrigins: string[]): void => {
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
            <Heading marginTop='default'>{error}</Heading>
          </Pane>
        </Styled>
      ),
      document.getElementById(id)
    )
  })

  sendToOpener({ error }, openerOrigin, validOrigins)

  try {
    // Electron may block this, it's best effort anyway.
    window.opener.focus()
  } catch (e) {}

  window.close()
}

// TODO: please fix following typescript error
// @ts-expect-error
window.renderError = renderError
