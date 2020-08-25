import { plugins as glamorPlugins } from 'glamor'
import {
  setClassNamePrefix,
  usePlugin as useUIBoxPlugin
} from '@treygriffith/ui-box'

// Need to heavily specify our styles to override anything set in the parent

const SCOPE_ID = 'xkit___embed'
const PREFIX_CLASS = 'xkit-'

function scopeSelector(selector: string): string {
  return selector.split(',').map((part: string) => {
    return `#${SCOPE_ID} ${part.trim()}`
  }).join(',')
}

interface GlamorDefinition<T> {
  selector: string,
  style: T
}

interface UIBoxDefinition<T> {
  selector: string,
  rules: T
}

function addGlamorScope<T> ({ selector, style }: GlamorDefinition<T>): GlamorDefinition<T> {
  return { selector: scopeSelector(selector), style }
}

function addUIBoxScope<T> ({ selector, rules }: UIBoxDefinition<T>): UIBoxDefinition<T> {
  return { selector: scopeSelector(selector), rules }
}

glamorPlugins.add(addGlamorScope)
useUIBoxPlugin(addUIBoxScope)
setClassNamePrefix(PREFIX_CLASS)

export { SCOPE_ID }
