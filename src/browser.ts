import createXkitWithCatalog from './index'
// @ts-expect-error
window.xkit = window.xkit || {}
// @ts-expect-error
window.xkit.init = function (domain: string) {
  Object.assign(this, createXkitWithCatalog(domain))
}
