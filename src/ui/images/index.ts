// Don't worry, this node.js stuff gets inlined by Parcel
import { readFileSync } from 'fs'

// Can't use path.join() here: https://github.com/parcel-bundler/parcel/issues/1736
// eslint-disable-next-line node/no-path-concat
export const logo = readFileSync(__dirname + '/xkit-logo-black.svg', 'utf8')
// eslint-disable-next-line node/no-path-concat
export const monoLogo = readFileSync(
  __dirname + '/xkit-logo-mono-black.svg',
  'utf8'
)
