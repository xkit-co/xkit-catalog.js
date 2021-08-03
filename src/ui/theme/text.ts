import { FontFamily } from '@treygriffith/evergreen-ui'
import { CatalogTheme } from './catalog-theme'
import cloneTheme from './clone-theme'

type HeadingSizes = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type TextSizes = 300 | 400 | 500 | 600
type ParagraphSizes = 300 | 400 | 500
type AllTextSizes = HeadingSizes | TextSizes | ParagraphSizes

function isHeadingSize(size: number): size is HeadingSizes {
  return size in [100, 200, 300, 400, 500, 600, 700, 800, 900]
}

function isTextSize(size: number): size is TextSizes {
  return isHeadingSize(size) && size > 200 && size < 700
}

function isParagraphSize(size: number): size is ParagraphSizes {
  return isTextSize(size) && size < 600
}

export type CustomTextProps = Partial<{
  fonts: Partial<Record<FontFamily, string>>
  colors: Partial<Record<'muted' | 'default' | 'dark' | 'selected', string>>
  sizes: Partial<Record<AllTextSizes, number>>
}>

export default function customizeText(
  originalTheme: CatalogTheme,
  props: CustomTextProps
): CatalogTheme {
  const theme = cloneTheme(originalTheme)
  if (props.fonts) {
    Object.assign(theme.typography.fontFamilies, props.fonts)
  }
  if (props.colors) {
    Object.assign(theme.colors.text, props.colors)
  }
  if (props.sizes) {
    for (const [sizeKey, fontSizeNum] of Object.entries(props.sizes)) {
      const fontSize = `${fontSizeNum}px`
      const size = parseInt(sizeKey, 10)
      if (isHeadingSize(size)) {
        Object.assign(theme.typography.headings[size], { fontSize })
      }
      if (isTextSize(size)) {
        Object.assign(theme.typography.text[size], { fontSize })
      }
      if (isParagraphSize(size)) {
        Object.assign(theme.typography.paragraph[size], { fontSize })
      }
    }
  }
  return theme
}
