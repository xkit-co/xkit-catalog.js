import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface RehomeEvergreenProps {
  components: string | string[]
}

// This component should only be used once per app.
// TODO: enforce that somehow
export default class RehomeEvergreen extends React.Component<RehomeEvergreenProps> {
  ref: React.RefObject<HTMLDivElement>

  constructor (props: {}) {
    super(props)
    this.ref = React.createRef<HTMLDivElement>()
  }

  private moveComponent (fromEl: HTMLElement, toEl: HTMLElement, name: string): void {
    if (!fromEl) {
      console.error(`xkit: Cannot move ${name} as its current container does not exist`)
    }
    const toasterEl = fromEl.querySelector(`[${name}]`)
    if (!toasterEl) {
      console.error(`xkit: Cannot move ${name} as it does not exist`)
      return
    }
    if (!toEl) {
      console.error(`xkit: Cannot move ${name} as its future container does not exist`)
      return
    }
    toEl.appendChild(toasterEl)
  }

  private components (): string[] {
    const { components } = this.props

    return Array.isArray(components) ? components : [components]
  }

  componentDidMount (): void {
    console.log('calling component did mount', this.components())
    // Need to move the components inside our element so we can style it
    this.components().forEach(name => this.moveComponent(window.document.body, this.ref.current, name))
  }

  componentWillUnmount (): void {
    // Move the components back to the body so they are not destroyed on unmount
    this.components().forEach(name => this.moveComponent(this.ref.current, window.document.body, name))
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
