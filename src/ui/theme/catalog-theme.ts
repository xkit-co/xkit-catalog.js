import { majorScale, defaultTheme } from '@treygriffith/evergreen-ui'
import { Theme } from './evergreen'

type CatalogPalette = typeof defaultTheme.palette & {
  base: string
}

type CatalogColors = typeof defaultTheme.colors & {
  background: typeof defaultTheme.colors.background & {
    base: string
  }
}

export interface CardProps {
  padding: number
  elevation: 1 | 2 | 3
  hoverElevation: 1 | 2 | 3
  borderRadius: number
}

export interface CatalogTheme extends Omit<Theme, 'palette' | 'colors'> {
  palette: CatalogPalette
  colors: CatalogColors
  card: CardProps
}

function keyAsValue(
  obj: { [index: string]: string },
  keyValue: string
): string {
  if (Object.prototype.hasOwnProperty.call(obj, keyValue) === true) {
    return obj[keyValue]
  }
  return keyValue
}

const ThemeHelpers: Partial<CatalogTheme> = {
  getBackground(background: string): string {
    return keyAsValue(this.colors.background, background)
  },
  getElevation(elevation: number): string {
    return this.elevations[elevation]
  },
  getIconColor(color: string): string {
    return keyAsValue(this.colors.icon, color)
  },
  getHeadingStyle(size = 500) {
    // Heading styles get passed straight through without
    // using the helpers, so we fix that
    const style = this.typography.headings[String(size)]
    if (style.fontFamily) {
      style.fontFamily = this.getFontFamily(style.fontFamily)
    }
    if (style.color) {
      style.color = this.getTextColor(style.color)
    }
    return style
  },
  getTextStyle(size = 400) {
    return this.typography.text[String(size)]
  },
  getParagraphStyle(size = 400) {
    return this.typography.paragraph[String(size)]
  },
  getFontFamily(family: string) {
    return keyAsValue(this.typography.fontFamilies, family)
  },
  getTextColor(color: string) {
    return keyAsValue(this.colors.text, color)
  }
}

export const defaultCatalogTheme: CatalogTheme = {
  ...defaultTheme,
  // We apply helpers that actually reference this object,
  // rather than hardcoded references
  ...ThemeHelpers,
  // Evergreen hardcodes some of the typography properties,
  // so we reset to the named properties
  typography: {
    ...defaultTheme.typography,
    text: {
      ...defaultTheme.typography.text,
      600: {
        ...defaultTheme.typography.text[600],
        fontFamily: 'display'
      }
    },
    headings: {
      ...defaultTheme.typography.headings,
      100: {
        ...defaultTheme.typography.headings[100],
        fontFamily: 'ui',
        color: 'muted'
      },
      200: {
        ...defaultTheme.typography.headings[200],
        fontFamily: 'ui',
        color: 'muted'
      },
      300: {
        ...defaultTheme.typography.headings[300],
        fontFamily: 'ui',
        color: 'dark'
      },
      400: {
        ...defaultTheme.typography.headings[400],
        fontFamily: 'ui',
        color: 'dark'
      },
      500: {
        ...defaultTheme.typography.headings[500],
        fontFamily: 'ui',
        color: 'dark'
      },
      600: {
        ...defaultTheme.typography.headings[600],
        fontFamily: 'display',
        color: 'dark'
      },
      700: {
        ...defaultTheme.typography.headings[700],
        fontFamily: 'display',
        color: 'dark'
      },
      800: {
        ...defaultTheme.typography.headings[800],
        fontFamily: 'display',
        color: 'dark'
      },
      900: {
        ...defaultTheme.typography.headings[900],
        fontFamily: 'display',
        color: 'dark'
      }
    }
  },
  colors: {
    ...defaultTheme.colors,
    background: {
      ...defaultTheme.colors.background,
      base: 'white'
    }
  },
  palette: {
    ...defaultTheme.palette,
    base: 'white'
  },
  card: {
    padding: majorScale(2),
    elevation: 1,
    hoverElevation: 3,
    borderRadius: 5
  }
}

export type ThemeConsumer<Props = {}> = Props & {
  theme: CatalogTheme
}
