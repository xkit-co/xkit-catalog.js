import * as React from 'react'
import { StyleAttribute } from 'glamor'
import {
  defaultTheme,
  Theme,
  // TODO: please fix following typescript error
  // @ts-expect-error
  withTheme as untypedWithTheme,
  ThemeProvider as UntypedProvider,
  useTheme as UntypedUseTheme
} from '@treygriffith/evergreen-ui'
// TODO: please fix following typescript error
// @ts-expect-error
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

  type TabAppearance = DefaultAppearance | 'minimal'

  interface Theme {
    getButtonClassName: (
      appearance: ButtonAppearance,
      intent: IntentTypes
    ) => string
    getBackground: (background: string) => string
    getElevation: (elevation: number) => string
    getIconColor: (color: string) => string
    getHeadingStyle: (
      size?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
    ) => TypographyStyle
    getTextStyle: (size?: 300 | 400 | 500 | 600) => TypographyStyle
    getParagraphStyle: (size?: 300 | 400 | 500) => TypographyStyle
    getFontFamily: (family: string) => string
    getTabClassName: (appearance: TabAppearance) => string
    getTextColor: (color: string) => string
  }
}

type AppearanceProps = Partial<{
  background: string
  backgroundColor: string
  backgroundImage: string
  borderRadius: number
  transition: string
  boxShadow: string
  opacity: number
  color: string
  textShadow: string
  outline: string
  cursor: string
  pointerEvents: string
}>

export type ButtonStateProps = Partial<{
  disabled: AppearanceProps
  base: AppearanceProps
  hover: AppearanceProps
  focus: AppearanceProps
  active: AppearanceProps
  focusAndActive: AppearanceProps
}>

export type TabStateProps = Partial<{
  base: AppearanceProps
  hover: AppearanceProps
  active: AppearanceProps
  focus: AppearanceProps
  current: AppearanceProps
  disabled: AppearanceProps
}>

interface ThemerType {
  createButtonAppearance: (props: ButtonStateProps) => StyleAttribute
  createTabAppearance: (props: TabStateProps) => StyleAttribute
}

const Themer = UntypedThemer as ThemerType

// ThemeProvider is not in the index.d.ts for evergreen
const ThemeProvider = UntypedProvider

type ThemeHOC = <Props extends {}>(
  WrappedComponent: React.ComponentType<Props>
) => React.ComponentType<Omit<Props, 'theme'>>

// withTheme is not in the index.d.ts for evergreen
const withTheme: ThemeHOC = untypedWithTheme as ThemeHOC

type themeHook = () => typeof defaultTheme

const useTheme: themeHook = UntypedUseTheme as themeHook

export { Theme, Themer, ThemeProvider, withTheme, useTheme }
