import * as React from 'react'
import tinycolor from 'tinycolor2'
import { css, StyleAttribute } from 'glamor'
import {
  majorScale,
  IntentTypes,
  FontFamily,
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
  type TypographyStyle = Partial<{
    color: string
    fontFamily: string
    fontSize: string
    fontWeight: number
    letterSpacing: string
    lineHeight: string
    marginTop: number
    textTransform: string
  }>

  interface Theme {
    getButtonClassName: (appearance: ButtonAppearance, intent: IntentTypes) => string,
    getBackground: (background: string) => string,
    getElevation: (elevation: number) => string,
    getIconColor: (color: string) => string,
    getHeadingStyle: (size?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => TypographyStyle,
    getTextStyle: (size?: 300 | 400 | 500 | 600) => TypographyStyle,
    getParagraphStyle: (size?: 300 | 400 | 500) => TypographyStyle,
    getFontFamily: (family: string) => string,
    getTextColor: (color: string) => string
  }
}

type CustomPalette = typeof defaultTheme.palette & {
  base: string
}

const palette: CustomPalette = {
  ...defaultTheme.palette,
  base: 'white'
}

interface CardProps {
  padding: number,
  elevation: 1 | 2 | 3,
  hoverElevation: 1 | 2 | 3,
  borderRadius: number
}

export interface CustomTheme extends Omit<Theme, 'palette'> {
  palette: CustomPalette,
  card: CardProps
}

const ThemeHelpers: Partial<CustomTheme> = {
  getBackground (background: string): string {
    return keyAsValue(this.colors.background, background)
  },
  getElevation (elevation: number): string {
    return this.elevations[elevation]
  },
  getIconColor (color: string): string {
    return keyAsValue(this.colors.icon, color)
  },
  getHeadingStyle (size = 500) {
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
  getTextStyle (size = 400) {
    return this.typography.text[String(size)]
  },
  getParagraphStyle (size = 400) {
    return this.typography.paragraph[String(size)]
  },
  getFontFamily (family: string) {
    return keyAsValue(this.typography.fontFamilies, family)
  },
  getTextColor (color: string) {
    return keyAsValue(this.colors.text, color)
  }
}

const defaultCustomTheme: CustomTheme = {
  ...defaultTheme,
  // We apply helpers that actually reference this object,
  // rather than hardcoded references
  ...ThemeHelpers,
  // Evergreen hardcodes some of the typography properties,
  // so we reset to the named properties
  typography: {
    ...defaultTheme.typography
    text: {
      ...defaultTheme.typography.text,
      '600': {
        ...defaultTheme.typography.text['600'],
        fontFamily: 'display'
      }
    },
    headings: {
      ...defaultTheme.typography.headings,
      '100': {
        ...defaultTheme.typography['100'],
        fontFamily: 'ui',
        color: 'muted'
      },
      '200': {
        ...defaultTheme.typography.headings['200'],
        fontFamily: 'ui',
        color: 'muted'
      },
      '300': {
        ...defaultTheme.typography.headings['300'],
        fontFamily: 'ui',
        color: 'dark'
      },
      '400': {
        ...defaultTheme.typography.headings['400'],
        fontFamily: 'ui',
        color: 'dark'
      },
      '500': {
        ...defaultTheme.typography.headings['500'],
        fontFamily: 'ui',
        color: 'dark'
      },
      '600': {
        ...defaultTheme.typography.headings['600'],
        fontFamily: 'display',
        color: 'dark'
      },
      '700': {
        ...defaultTheme.typography.headings['700'],
        fontFamily: 'display',
        color: 'dark'
      },
      '800': {
        ...defaultTheme.typography.headings['800'],
        fontFamily: 'display',
        color: 'dark'
      },
      '900': {
        ...defaultTheme.typography.headings['900'],
        fontFamily: 'display',
        color: 'dark'
      }
    }
  }
  palette,
  card: {
    padding: majorScale(2),
    elevation: 1,
    hoverElevation: 3,
    borderRadius: 5
  }
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
    card: { ...theme.card },
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

type HeadingSizes = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type TextSizes = 300 | 400 | 500 | 600
type ParagraphSizes = 300 | 400 | 500
type AllTextSizes = HeadingSizes | TextSizes | ParagraphSizes

function isTextSize (size: AllTextSizes): size is TextSizes {
  return size > 200 && size < 700
}

function isParagraphSize (size: AllTextSizes): size is ParagraphSizes {
  return size > 200 && size < 600
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

export type CustomThemeProps = Partial<{
  text: Partial<{
    fonts: Partial<Record<FontFamily, string>>,
    colors: Partial<Record<'muted' | 'default' | 'dark' | 'selected', string>>,
    sizes: Partial<Record<AllTextSizes, number>>
  }>
  buttons: Partial<{
    primary: HasBackground & HasTextColor,
    default: HasBackground & HasTextColor,
    // Note: we don't use minimal buttons
    minimal: HasBackground & HasTextColor
  }>
  card: Partial<CardProps>
}>

function getLinearGradient(top: string, bottom: string): string {
  return `linear-gradient(to bottom, ${top}, ${bottom})`
}

interface LinearGradientState {
  base: string,
  hover: string,
  active: string
}

function emphasizeLinearGradient(startStr: string, endStr: string, amount: number): string {
  const start = tinycolor(startStr)
  const end = tinycolor(endStr)

  // we want to modify both colors in the same direction, so we choose one to be the
  // one we'll use as a brightness guide
  if (end.isLight()) {
    return getLinearGradient(start.darken(amount).toString(), end.darken(amount).toString())
  }

  return getLinearGradient(start.lighten(amount).toString(), end.lighten(amount).toString())
}

function getLinearGradientStates(start: string, end: string): LinearGradientState {
  return {
    base: getLinearGradient(start, end),
    hover: emphasizeLinearGradient(start, end, 5),
    active: emphasizeLinearGradient(end, end, 5)
  }
}

function getStartColor (background: Background): string {
  if (isGradient(background)) {
    return background.start
  }

  return background
}

function getEndColor (background: Background): string {
  if (isGradient(background)) {
    return background.end
  }

  return background
}

function getBackgroundImage (prop: HasBackground, state: 'base' | 'hover' | 'active'): string {
  const background = prop.background

  return getLinearGradientStates(getStartColor(background), getEndColor(background))[state]
}

function defaultControlStyles (theme: CustomTheme): ButtonStateProps {
  return {
    disabled: {
      opacity: 0.8,
      backgroundImage: 'none',
      backgroundColor: theme.scales.neutral.N2A,
      boxShadow: 'none',
      color: theme.scales.neutral.N7A,
      pointerEvents: 'none'
    },
    base: {
      backgroundColor: 'white',
      backgroundImage: getLinearGradient('#FFFFFF', '#F4F5F7'),
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 -1px 1px 0 ${
        theme.scales.neutral.N2A
      }`
    },
    hover: {
      backgroundImage: getLinearGradient('#FAFBFB', '#EAECEE')
    },
    focus: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${
        theme.scales.neutral.N5A
      }, inset 0 -1px 1px 0 ${theme.scales.neutral.N4A}`
    },
    active: {
      backgroundImage: 'none',
      backgroundColor: theme.scales.blue.B3A,
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 1px 1px 0 ${
        theme.scales.neutral.N2A
      }`
    },
    focusAndActive: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${
        theme.scales.neutral.N5A
      }, inset 0 1px 1px 0 ${theme.scales.neutral.N2A}`
    }
  }
}

function keyAsValue(obj: { [index: string]: string }, keyValue: string): string {
  if (obj.hasOwnProperty(keyValue)) {
    return obj[keyValue]
  }
  return keyValue
}

function buildTheme(props: CustomThemeProps): CustomTheme {
  if (!Object.keys(props).length)  {
    return defaultCustomTheme
  }

  const theme = cloneTheme(defaultCustomTheme)

  if (props.card) {
    Object.assign(theme.card, props.card)
  }

  const textProps = props.text

  if (textProps) {
    if (textProps.fonts) {
      Object.assign(theme.typography.fontFamilies, textProps.fonts)
    }
    if (textProps.colors) {
      Object.assign(theme.colors.text, textProps.colors)
    }
    if (textProps.sizes) {
      for (const [size, fontSize] of Object.entries(textProps.sizes)) {
        Object.assign(theme.typography.headings[size], { fontSize })
        if (isTextSize(size)) {
          Object.assign(theme.typography.text[size], { fontSize })
        }
        if (isParagraphSize(size)) {
          Object.assign(theme.typography.paragraph[size], { fontSize })
        }
      }
    }
  }

  const buttons = props.buttons

  if (buttons) {
    theme.getButtonClassName = function (appearance: ButtonAppearance, intent: IntentTypes): string {
      const buttonProps = buttons[appearance]

      if (!buttonProps || (intent && intent !== 'none')) {
        return defaultCustomTheme.getButtonClassName(appearance, intent)
      }

      const focusColor = tinycolor(getStartColor(buttonProps.background)).setAlpha(0.4).toString()
      const defaults = defaultControlStyles(this)

      return css(Themer.createButtonAppearance({
        ...defaults,
        base: {
          ...defaults.base,
          color: buttonProps.textColor,
          backgroundColor: getStartColor(buttonProps.background),
          backgroundImage: getBackgroundImage(buttonProps, 'base')
        },
        hover: {
          ...defaults.hover,
          backgroundImage: getBackgroundImage(buttonProps, 'hover')
        },
        focus: {
          ...defaults.focus,
          boxShadow: `0 0 0 3px ${focusColor}, inset 0 0 0 1px ${
            this.scales.neutral.N4A
          }, inset 0 -1px 1px 0 ${this.scales.neutral.N5A}`
        },
        active: {
          ...defaults.active,
          backgroundImage: getBackgroundImage(buttonProps, 'active')
        },
        focusAndActive: {
          ...defaults.focusAndActive,
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
 
