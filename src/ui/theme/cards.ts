import { CardProps, CatalogTheme } from './catalog-theme'

export type CustomCardProps = Partial<CardProps>

export default function customizeCards(
  theme: CatalogTheme,
  props: CustomCardProps
): CatalogTheme {
  return {
    ...theme,
    card: {
      ...theme.card,
      ...props
    }
  }
}
