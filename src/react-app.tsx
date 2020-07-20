import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App, { isRouterType } from './ui/app'
import { domReady } from './util'
import { login } from '@xkit-co/xkit.js/lib/api/session'
import { XkitJs } from '@xkit-co/xkit.js'

declare global {
  interface Window {
    xkit?: XkitJs
  }
}

domReady(document, () => {
  const domRoot = document.getElementById('xkit-app')

  // If the domRoot doesn't exist, we're probably not on the right page and we can skip rendering
  if (!domRoot) {
    return
  }

  const xkitDomain = (window.xkit && window.xkit.domain) ? window.xkit.domain : null
  const domain = domRoot.dataset.domain || xkitDomain || `${window.location.host}`
  const token = domRoot.dataset.token
  const rootPath = domRoot.dataset.path
  const routerType = domRoot.dataset.router
  const title = domRoot.dataset.title
  const hideTitle = domRoot.dataset.hideTitle === 'true'
  const loginRedirect = domRoot.dataset.loginRedirect

  // Only render the app if we are allowed to render from anywhere (no root path),
  // we're using a memory router, or if we are on the correct path. This allows
  // a developer to include this script in every page and only have it render on the
  // correct page.
  if (!rootPath || routerType === 'memory' || window.location.pathname.startsWith(rootPath)) {
    ReactDOM.render(
      <App
        domain={domain}
        token={token}
        rootPath={rootPath}
        routerType={isRouterType(routerType) ? routerType : undefined}
        title={title}
        hideTitle={hideTitle}
        loginRedirect={loginRedirect}
      />,
      domRoot
    )
  } else {
    if (token) {
      const doLogin = async () => {
        try {
          await login({ domain }, token)
        } catch (e) {
          console.debug(`Pre-emptive login failed: ${e.message}`)
          console.debug(e)
        }
      }
      doLogin()
    }
  }
})
