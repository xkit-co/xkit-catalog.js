import renderDom from './dom'
// @ts-ignore
window.xkit = window.xkit || {}
// @ts-ignore
window.xkit.init = function (domain: string, elemId?: string) {
  Object.assign(this, renderDom(domain, elemId))
}
