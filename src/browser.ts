import createXkitWithCatalog from './index'
// TODO: please fix following typescript error
// @ts-expect-error
window.xkit = window.xkit || {}
// TODO: please fix following typescript error
// @ts-expect-error
window.xkit.init = function (domain: string) {
  Object.assign(this, createXkitWithCatalog(domain))
}
