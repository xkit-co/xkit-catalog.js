function noop(): void {}

export function domReady(document: Document, fn: Function): void {
  if (document.readyState !== 'loading') {
    fn()
    return
  }
  const listener = (): void => {
    fn()
    document.removeEventListener('DOMContentLoaded', listener)
  }
  document.addEventListener('DOMContentLoaded', listener)
}

export function sendToOpener(
  message: unknown,
  openerOrigin: string,
  validOrigins: string[]
): void {
  const opener = window.opener

  if (!opener || opener.closed) {
    return
  }

  try {
    // Support situations that don't have a location origin.
    if (openerOrigin !== '') {
      opener.postMessage(message, openerOrigin)
    } else {
      if (validOrigins.includes(opener.location.origin)) {
        opener.postMessage(message, opener.location.origin)
      } else {
        logger.error(
          `Could not find valid origin to notify: ${opener.location.origin}` // eslint-disable-line @typescript-eslint/restrict-template-expressions
        )
      }
    }
  } catch (e) {
    // Brute force the message.
    validOrigins.forEach((validOrigin) => {
      try {
        opener.postMessage(message, validOrigin)
      } catch (e) {}
    })
  }
}

export function listenToOpener(
  fn: (msg: unknown) => void,
  openerOrigin: string,
  validOrigins: string[]
): void {
  window.addEventListener('message', (event) => {
    const isValidOrigin =
      event.origin === openerOrigin || validOrigins.includes(event.origin)

    // Electron breaks the connection between event.source and window.opener
    // and we may not have access to the `location` property, so we skip
    // this check and rely on the origin if we're in Electron.
    if (
      isValidOrigin &&
      (event.source === window.opener || /electron/i.test(navigator.userAgent))
    ) {
      fn(event.data)
    }
  })
}

export function injectCSS(document: Document, css: string): HTMLElement {
  const styleTag = document.createElement('style')
  styleTag.type = 'text/css'
  styleTag.setAttribute('data-xkit', '')
  styleTag.appendChild(document.createTextNode(css))
  domReady(document, () => document.head.appendChild(styleTag))
  return styleTag
}

export function removeCSS(document: Document, el: HTMLElement): void {
  domReady(document, () => el.remove())
}

export const logger = {
  info: console.log.bind(console, 'Xkit:'),
  error: console.error.bind(console, 'Xkit:'),
  warn: console.warn.bind(console, 'Xkit:'),
  debug:
    process.env.NODE_ENV === 'development'
      ? console.debug.bind(console, 'Xkit:')
      : noop
}

// thx: https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function errorMessage(e: any): string {
  if (e instanceof Error) {
    return e.message
  } else {
    return String(e)
  }
}
