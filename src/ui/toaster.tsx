import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  toaster as defaultToaster
} from '@treygriffith/evergreen-ui'
// TODO: allow customization / BYOToaster

interface ToasterSettings {
  description?: React.ReactNode
  duration?: number
  id?: string
  hasCloseButton?: boolean
}

const toaster: typeof defaultToaster = {
  ...defaultToaster,
  danger: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.error(title)
    }
    defaultToaster.danger(title, settings)
  },
  warning: (title: string, settings?: ToasterSettings): void => {
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.warn(title)
    }
    defaultToaster.warning(title, settings)
  }
}

// The Toaster component should only be used once per app.
// TODO: enforce that somehow
class Toaster extends React.Component {
  ref: React.RefObject<HTMLDivElement>

  constructor (props: {}) {
    super(props)
    this.ref = React.createRef<HTMLDivElement>()
  }

  private moveToaster (fromEl: HTMLElement, toEl: HTMLElement): void {
    if (!fromEl) {
      console.error('xkit: Cannot move notification toaster as its current container does not exist')
    }
    const toasterEl = fromEl.querySelector('[data-evergreen-toaster-container]')
    if (!toasterEl) {
      console.error('xkit: Cannot move notification toaster as it does not exist')
      return
    }
    if (!toEl) {
      console.error('xkit: Cannot move notification toaster as its future container does not exist')
      return
    }
    toEl.appendChild(toasterEl)
  }

  componentDidMount (): void {
    // Need to move the toaster inside our element so we can style it
    this.moveToaster(window.document.body, this.ref.current)
  }

  componentWillUnmount (): void {
    // Move the toaster back to the body so it is not destroyed on unmount
    this.moveToaster(this.ref.current, window.document.body)
  }

  render () {
    const { children } = this.props
    return (
      <div ref={this.ref}>
        {children}
      </div>
    )
  }
}

export {
  // TODO: use a context rather than importing the toaster from this file.
  // May help us enforce the one-Toaster-per-app rule
  toaster,
  Toaster
}
