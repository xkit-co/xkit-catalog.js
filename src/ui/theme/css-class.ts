import { css, Rule } from 'glamor'

export default function cssClass(...rules: Rule[]): string {
  // css() declares StyleAttribute as the returned type which raises a linter warning:
  // "css(rules) will evaluate to '[object Object]' when stringified".
  // But in fact it returns a map like so: {data-css-182i7se: "", toString: ƒ}
  // which when stringified turns into "data-css-182i7se".
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return css(rules).toString()
}
