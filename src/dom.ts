import createXkitCatalog from './'
import { domReady } from './util'

function renderDom (xkitDomain?: string, elemId = 'xkit-app'): void {
  domReady(document, () => {
    const domRoot = document.getElementById(elemId)

    // If the domRoot doesn't exist, we're probably not on the right page and we can skip rendering
    if (!domRoot) {
      return
    }

    // Xkit config
    const domain = domRoot.dataset.domain || xkitDomain || `${window.location.host}`
    const token = domRoot.dataset.token

    // Catalog-specific config
    const rootPath = domRoot.dataset.path
    const routerType = domRoot.dataset.router
    const title = domRoot.dataset.title
    const hideTitle = domRoot.dataset.hideTitle === 'true'

    // Create our catalog
    const xkitCatalog = createXkitCatalog(domain)

    // Attempt a login
    const doLogin = async () => {
      try {
        if (token) {
          await xkitCatalog.login(token)
        } else {
          await xkitCatalog.getAccessToken()
        }
      } catch (e) {
        console.debug(`Login failed: ${e.message}`, e)
      }
    }
    doLogin()

    // Only render the app if we are allowed to render from anywhere (no root path),
    // we're using a memory router, or if we are on the correct path. This allows
    // a developer to include this script in every page and only have it render on the
    // correct page.
    if (!rootPath || routerType === 'memory' || window.location.pathname.startsWith(rootPath)) {
      xkitCatalog.render(domRoot, {
        rootPath,
        routerType,
        title,
        hideTitle
      })
    }
  })
}

export default renderDom
