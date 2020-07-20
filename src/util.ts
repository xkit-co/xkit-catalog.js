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
