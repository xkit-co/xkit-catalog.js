import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import APIKeyApp, { APIKeyAppOptions } from './ui/api-key/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

const renderAPIKey = function (opts: APIKeyAppOptions): void {
  domReady(window.document, () => {
    const xkit = createXkit(window.location.host)
    ReactDOM.render(
      <APIKeyApp xkit={xkit} {...opts} />,
      document.getElementById('root')
    )
  })
}

// @ts-ignore
window.renderAPIKey = renderAPIKey

