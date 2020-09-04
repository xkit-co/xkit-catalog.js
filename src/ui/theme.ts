import * as React from 'react'
import {
  defaultTheme,
  Theme,
  // @ts-ignore
  withTheme as untypedWithTheme,
  // @ts-ignore
  ThemeProvider as UntypedProvider
} from '@treygriffith/evergreen-ui'

type CustomPalette = typeof defaultTheme.palette & {
  base: string
}

const palette: CustomPalette = {
  ...defaultTheme.palette,
  base: 'white'
}

export interface CustomTheme extends Omit<Theme, 'palette'> {
  palette: CustomPalette
}

const defaultCustomTheme: CustomTheme = {
  ...defaultTheme,
  palette
}

export type ThemeConsumer<Props = {}> = Props & {
  theme: CustomTheme
}

// ThemeProvider is not in the index.d.ts for evergreen
const ThemeProvider = UntypedProvider as React.Provider<typeof defaultTheme>

type ThemeHOC = <Props extends {}>(WrappedComponent: React.ComponentType<Props>) => React.ComponentType<Omit<Props, keyof ThemeConsumer>>

// withTheme is not in the index.d.ts for evergreen
const withTheme: ThemeHOC = untypedWithTheme as ThemeHOC

function cloneTheme(theme: CustomTheme): CustomTheme {
  return {
    ...theme,
    colors: {
      background: { ...theme.colors.background },
      border: { ...theme.colors.border },
      text: { ...theme.colors.text },
      icon: { ...theme.colors.icon },
      intent: { ...theme.colors.intent }
    },
    elevations: [ ...theme.elevations ],
    fills: {
      solid: {
        neutral: { ...theme.fills.solid.neutral },
        blue: { ...theme.fills.solid.blue },
        red: { ...theme.fills.solid.red },
        orange: { ...theme.fills.solid.orange },
        yellow: { ...theme.fills.solid.yellow },
        green: { ...theme.fills.solid.green },
        teal: { ...theme.fills.solid.teal },
        purple: { ...theme.fills.solid.purple }
      },
      subtle: {
        neutral: { ...theme.fills.subtle.neutral },
        blue: { ...theme.fills.subtle.blue },
        red: { ...theme.fills.subtle.red },
        orange: { ...theme.fills.subtle.orange },
        yellow: { ...theme.fills.subtle.yellow },
        green: { ...theme.fills.subtle.green },
        teal: { ...theme.fills.subtle.teal },
        purple: { ...theme.fills.subtle.purple }
      },
      options: [ ...theme.fills.options ]
    },
    palette: {
      ...theme.palette,
      neutral: { ...theme.palette.neutral },
      blue: { ...theme.palette.blue },
      red: { ...theme.palette.red },
      orange: { ...theme.palette.orange },
      yellow: { ...theme.palette.yellow },
      green: { ...theme.palette.green },
      teal: { ...theme.palette.teal },
      purple: { ...theme.palette.purple }
    },
    scales: {
      neutral: { ...theme.scales.neutral },
      blue: { ...theme.scales.blue }
    },
    avatarColors: [ ...theme.avatarColors ],
    badgeColors: [ ...theme.badgeColors ],
    typography: {
      headings: { ...theme.typography.headings },
      text: { ...theme.typography.text },
      fontFamilies: { ...theme.typography.fontFamilies },
      paragraph: { ...theme.typography.paragraph }
    }
  }
}

export interface CustomThemeProps {
  primaryButtonColor: string
}

function buildTheme(props: CustomThemeProps): CustomTheme {
  if (!Object.keys(props).length)  {
    return defaultCustomTheme
  }

  const theme = cloneTheme(defaultCustomTheme)

  return theme
}

export { buildTheme, ThemeProvider, withTheme }
 
