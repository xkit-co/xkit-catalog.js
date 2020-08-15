import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App, { AppProps, isRouterType } from './ui/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

export type CatalogOptions = Omit<AppProps, 'inheritRouter'>

export interface XkitCatalog extends XkitJs {
  render: (el: HTMLElement) => void
}

function renderCatalog(xkit: XkitJs, el: HTMLElement, opts: CatalogOptions): void {
  ReactDOM.render(
    <App
      xkit={xkit}
      rootPath={opts.rootPath}
      routerType={isRouterType(opts.routerType) ? opts.routerType : undefined}
      title={opts.title}
      hideTitle={opts.hideTitle}
    />,
    el
  )
}

function createXkitCatalog (domain: string): XkitCatalog {
  const xkit = createXkit(domain)
  xkit.render = renderCatalog.bind(null, xkit)
  return xkit
}

export default createXkitCatalog
