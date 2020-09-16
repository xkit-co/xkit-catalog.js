import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import APIKeyApp from './ui/api-key/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

domReady(window.document, () => {
  const xkit = createXkit(window.location.hostname)
  ReactDOM.render(
    <APIKeyApp xkit={xkit} />,
    document.getElementById('root')
  )
})
