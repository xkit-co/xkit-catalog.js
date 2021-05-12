const {
  readFileSync,
  writeFileSync,
  statSync,
  readdirSync
} = require('fs')
const path = require('path')

// TODO: configurable
const CSS_EXTENSION = '.css'

function precompileCSS (fileContents) {
  const escaped = fileContents.replace(/`/g, '\\`')

  return `module.exports = \`${escaped}\`;`
}

function precompileFile (src, dest) {
  const contents = readFileSync(src, 'utf8')
  const compiled = precompileCSS(contents)
  writeFileSync(dest + '.js', compiled, 'utf8')
}

function precompileDirectory (src, dest) {
  const stats = statSync(src)
  if (!stats.isDirectory()) {
    if (src.endsWith(CSS_EXTENSION)) {
      precompileFile(src, dest)
    }
    return
  }
  const files = readdirSync(src)
  files.forEach(filename => {
    precompileDirectory(path.join(src, filename), path.join(dest, filename))
  })
}

module.exports = precompileDirectory
