// Don't worry, this node.js stuff gets inlined by Parcel
import { readFileSync } from 'fs'
import { join } from 'path'

export const logo = readFileSync(join(__dirname, 'xkit-logo-black.svg'), 'utf8')
export const monoLogo = readFileSync(join(__dirname, '/xkit-logo-mono-black.svg'), 'utf8')
