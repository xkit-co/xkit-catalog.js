import * as React from 'react'
import tinycolor from 'tinycolor2'
import { css, StyleAttribute } from 'glamor'
import {
  IntentTypes,
  ButtonAppearance,
  defaultTheme,
  Theme,
  // @ts-ignore
  withTheme as untypedWithTheme,
  // @ts-ignore
  ThemeProvider as UntypedProvider
} from '@treygriffith/evergreen-ui'
// @ts-ignore
import { Themer as UntypedThemer } from '@treygriffith/evergreen-ui/commonjs/themer'

declare module '@treygriffith/evergreen-ui' {
  interface Theme {
    getButtonClassName: (appearance: ButtonAppearance, intent: IntentTypes) => string
  }
}

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

type ButtonProps = Partial<{
  opacity: number,
  backgroundImage: string,
  backgroundColor: string,
  boxShadow: string,
  color: string,
  pointerEvents: string
}>

type ButtonStateProps = Partial<{
  disabled: ButtonProps,
  base: ButtonProps,
  hover: ButtonProps,
  focus: ButtonProps,
  active: ButtonProps,
  focusAndActive: ButtonProps
}>

interface ThemerType {
  createButtonAppearance: (props: ButtonStateProps) => StyleAttribute
}

const Themer = UntypedThemer as ThemerType

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

interface Gradient {
  start: string,
  end: string
}

type Background = string | Gradient

function isGradient (bg: Background): bg is Gradient {
  if (!bg) return false
  if (typeof bg === 'string') return false
  return true
}

interface HasBackground {
  background: Background
}

interface HasTextColor {
  textColor: string
}

export interface CustomThemeProps {
  primaryButton?: HasBackground & HasTextColor
}

function getLinearGradient(top: string, bottom: string): string {
  return `linear-gradient(to bottom, ${top}, ${bottom})`
}

interface LinearGradientState {
  base: string,
  hover: string,
  active: string
}

function getLinearGradientStates(start: string, end: string): LinearGradientState {
  const darkStart = tinycolor(start).darken(5).toString()
  const darkEnd = tinycolor(end).darken(5).toString()
  return {
    base: getLinearGradient(start, end),
    hover: getLinearGradient(darkStart, darkEnd),
    active: getLinearGradient(darkEnd, darkEnd)
  }
}

function getBaseColor (prop: HasBackground): string | undefined {
  const background = prop.background

  if (isGradient(background)) {
    return background.start
  }

  return background
}

function getBackgroundImage (prop: HasBackground, state: 'base' | 'hover' | 'active'): string {
  const background = prop.background

  if (isGradient(background)) {
    return getLinearGradientStates(background.start, background.end)[state]
  }

  return 'none'
}

function buildTheme(props: CustomThemeProps): CustomTheme {
  if (!Object.keys(props).length)  {
    return defaultCustomTheme
  }

  const theme = cloneTheme(defaultCustomTheme)

  const primaryButton = props.primaryButton

  if (primaryButton) {
    theme.getButtonClassName = function (appearance: ButtonAppearance, intent: IntentTypes): string {
      if (appearance !== 'primary' || (intent && intent !== 'none')) {
        return defaultCustomTheme.getButtonClassName(appearance, intent)
      }

      const focusColor = tinycolor(getBaseColor(primaryButton)).setAlpha(0.4).toString()

      return css(Themer.createButtonAppearance({
        disabled: {
          opacity: 0.8,
          backgroundImage: 'none',
          backgroundColor: this.scales.neutral.N2A,
          boxShadow: 'none',
          color: this.scales.neutral.N7A,
          pointerEvents: 'none'
        },
        base: {
          color: primaryButton.textColor,
          backgroundColor: getBaseColor(primaryButton),
          backgroundImage: getBackgroundImage(primaryButton, 'base'),
          boxShadow: `inset 0 0 0 1px ${
            this.scales.neutral.N5A
          }, inset 0 -1px 1px 0 ${this.scales.neutral.N2A}`
        },
        hover: {
          backgroundImage: getBackgroundImage(primaryButton, 'hover')
        },
        focus: {
          boxShadow: `0 0 0 3px ${focusColor}, inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 -1px 1px 0 ${this.scales.neutral.N5A}`
        },
        active: {
          backgroundImage: getBackgroundImage(primaryButton, 'active'),
          boxShadow: `inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 1px 1px 0 ${this.scales.neutral.N2A}`
        },
        focusAndActive: {
          boxShadow: `0 0 0 3px ${focusColor}, inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 1px 1px 0 ${this.scales.neutral.N2A}`
        }
      })).toString()
    }
  }

  return theme
}

export { buildTheme, ThemeProvider, withTheme }
 
