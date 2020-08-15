import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App, { AppOptions, isRouterType } from './ui/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

export interface CatalogOptions extends Omit<AppOptions, 'inheritRouter' | 'routerType'> {
  routerType: string
}

export interface XkitCatalog extends XkitJs {
  render: (el: HTMLElement, opts: CatalogOptions) => void
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
  const xkitCatalog = Object.assign({}, xkit, {
    render: renderCatalog.bind(null, xkit)
  })
  return xkitCatalog
}

export default createXkitCatalog
