export function domReady (document: Document, fn: Function) {
  if (document.readyState !== 'loading') {
    fn()
    return
  }
  const listener = () => {
    fn()
    document.removeEventListener('DOMContentLoaded', listener)
  }
  document.addEventListener('DOMContentLoaded', listener)
}

export function injectCSS (document: Document, css: string): HTMLElement {
  const styleTag = document.createElement('style')
  styleTag.type = 'text/css'
  styleTag.setAttribute('data-xkit', '')
  styleTag.appendChild(document.createTextNode(css))
  domReady(document, () => document.head.appendChild(styleTag))
  return styleTag
}

export function removeCSS (document: Document, el: HTMLElement): void {
  domReady(document, () => el.remove())
}
