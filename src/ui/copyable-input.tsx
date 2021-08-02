import * as React from 'react'
import {
  TextInput,
  TextInputProps,
  Textarea,
  TextareaProps
} from '@treygriffith/evergreen-ui'
import { useTheme } from './theme'

type CopyableTextInputProps = TextInputProps & {
  fontFamily?: string
}

export const CopyableTextInput: React.FunctionComponent<CopyableTextInputProps> =
  ({ value, fontFamily, ...props }) => {
    const theme = useTheme()

    return (
      <TextInput
        width='100%'
        readOnly
        value={value}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
        style={{ fontFamily: theme.getFontFamily(fontFamily) }}
        {...props}
      />
    )
  }

type CopyableTextareaProps = TextareaProps & {
  fontFamily?: string
}

export const CopyableTextarea: React.FunctionComponent<CopyableTextareaProps> =
  ({ value, fontFamily, ...props }) => {
    const theme = useTheme()

    return (
      <Textarea
        width='100%'
        readOnly
        value={value}
        onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) =>
          e.target.select()
        }
        style={{ fontFamily: theme.getFontFamily(fontFamily) }}
        {...props}
      />
    )
  }
