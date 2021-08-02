import * as React from 'react'
import {
  // TODO: please fix following typescript error
  // @ts-expect-error
  plugins as untypedGlamorPlugins
} from 'glamor'
import {
  setClassNamePrefix,
  usePlugin as useUIBoxPlugin
} from '@treygriffith/ui-box'
import { injectCSS, removeCSS } from '../util'
import resetStyles from './reset.css'

// Plugins aren't in Glamor's type definition
interface StyleDefinition {
  selector: string
  style: unknown
}
type PluginFn = (def: StyleDefinition) => StyleDefinition

interface PluginSet {
  add: (fn: PluginFn) => void
}

const glamorPlugins = untypedGlamorPlugins as PluginSet

// Need to heavily specify our styles to override anything set in the parent
const SCOPE_ID = 'xkit___embed'
const PREFIX_CLASS = 'xkit-'

function scopeSelector(selector: string): string {
  return selector
    .split(',')
    .map((part: string) => {
      return `#${SCOPE_ID} ${part.trim()}`
    })
    .join(',')
}

interface GlamorDefinition<T> {
  selector: string
  style: T
}

interface UIBoxDefinition<T> {
  selector: string
  rules: T
}

function addGlamorScope<T>({
  selector,
  style
}: GlamorDefinition<T>): GlamorDefinition<T> {
  return { selector: scopeSelector(selector), style }
}

function addUIBoxScope<T>({
  selector,
  rules
}: UIBoxDefinition<T>): UIBoxDefinition<T> {
  return { selector: scopeSelector(selector), rules }
}

// These are applied globally
glamorPlugins.add(addGlamorScope)
useUIBoxPlugin(addUIBoxScope) // eslint-disable-line react-hooks/rules-of-hooks
setClassNamePrefix(PREFIX_CLASS)

interface StyledState {
  cssTag?: HTMLElement
}

// An App MUST include the Styled component **exactly once**, otherwise styles won't work
// the way you expect them to. This component both resets styles for the its children
// and applies the scoping ID for stronger style rules.
export class Styled extends React.Component<{}, StyledState> {
  componentDidMount(): void {
    this.setState({
      cssTag: injectCSS(
        window.document,
        resetStyles.replace(/%\{SCOPE_ID\}/g, SCOPE_ID)
      )
    })
  }

  componentWillUnmount(): void {
    const { cssTag } = this.state
    if (cssTag) {
      removeCSS(window.document, cssTag)
    }
  }

  render(): React.ReactElement {
    const { children } = this.props
    return <div id={SCOPE_ID}>{children}</div>
  }
}
