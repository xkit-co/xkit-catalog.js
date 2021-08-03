import { ThemeProvider, withTheme, useTheme } from './evergreen'
import {
  defaultCatalogTheme,
  ThemeConsumer,
  CatalogTheme
} from './catalog-theme'
import customizeButtons, { CustomButtonsProps } from './buttons'
import customizeTabs, { CustomTabProps } from './tabs'
import customizeText, { CustomTextProps } from './text'
import customizeCards, { CustomCardProps } from './cards'

type CatalogThemeProps = Partial<{
  text: CustomTextProps
  buttons: CustomButtonsProps
  card: CustomCardProps
  tab: CustomTabProps
}>

function buildTheme(props: CatalogThemeProps): CatalogTheme {
  let theme = defaultCatalogTheme

  if (props.card) {
    theme = customizeCards(theme, props.card)
  }

  if (props.text) {
    theme = customizeText(theme, props.text)
  }

  if (props.buttons) {
    theme = customizeButtons(theme, props.buttons)
  }

  // Call it always, adds "minimal" appearance.
  theme = customizeTabs(theme, props.tab)

  return theme
}

export {
  CatalogTheme,
  buildTheme,
  CatalogThemeProps,
  ThemeProvider,
  withTheme,
  useTheme,
  ThemeConsumer
}
