import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import CollectApp, { AppOptions } from './ui/api-key/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

const renderCollect = function (opts: AppOptions): void {
  domReady(window.document, () => {
    const xkit = createXkit(window.location.host)
    ReactDOM.render(
      <CollectApp xkit={xkit} {...opts} />,
      document.getElementById('root')
    )
  })
}

// @ts-ignore
window.renderCollect = renderCollect

