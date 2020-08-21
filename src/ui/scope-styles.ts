import { plugins } from 'glamor'
import { setClassNamePrefix } from 'ui-box'

// Need to heavily specify our styles to override anything set in the parent

const SCOPE_ID = 'xkit___embed'
const PREFIX_CLASS = `xkit-`

plugins.add(({ selector, style }) => {
  const scopedSelector = selector.split(',').map(part => {
    return `#${SCOPE_ID} ${part.trim()}`
  }).join(',')
  return { selector: scopedSelector, style }
})
setClassNamePrefix(PREFIX_CLASS)

export { SCOPE_ID }
