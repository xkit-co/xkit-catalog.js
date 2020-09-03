import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import APIKeyApp from './ui/api-key/app'

domReady(window.document, () => {
  ReactDOM.render(
    <APIKeyApp />,
    document.getElementById('root')
  )
})
