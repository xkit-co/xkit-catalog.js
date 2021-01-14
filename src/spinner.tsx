import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import { Styled } from './ui/scope-styles'
import {
  Pane,
  Spinner,
  Heading
} from '@treygriffith/evergreen-ui'

const renderLoading = (id, title) => {
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
}

// @ts-ignore
window.renderLoading = renderLoading
