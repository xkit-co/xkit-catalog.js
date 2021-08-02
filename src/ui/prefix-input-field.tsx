import * as React from 'react'
import {
  Pane,
  Text,
  FormField,
  FormFieldProps,
  TextInput,
  TextInputProps,
  majorScale
} from '@treygriffith/evergreen-ui'

type PrefixInputFieldProps = TextInputProps &
  FormFieldProps & {
    suffix: string
  }

class PrefixInputField extends React.Component<PrefixInputFieldProps> {
  private readonly suffixPane = React.createRef<HTMLDivElement>()

  render(): React.ReactElement {
    const { suffix, ...restProps } = this.props
    const {
      value,
      isInvalid,
      onChange,
      onKeyDown,
      placeholder,
      disabled,
      ...formFieldProps
    } = restProps
    const inputProps = {
      value,
      isInvalid,
      onChange,
      onKeyDown,
      placeholder,
      disabled
    }

    const width = this.suffixPane.current
      ? this.suffixPane.current.offsetWidth
      : 75

    return (
      <FormField {...formFieldProps} marginBottom={majorScale(3)}>
        <Pane position='relative'>
          <TextInput {...inputProps} width='100%' paddingRight={width} />
          <Pane position='absolute' right={0} top={0} pointerEvents='none'>
            <div ref={this.suffixPane}>
              <Text
                display='block'
                padding={6}
                paddingRight={majorScale(1)}
                color='muted'
              >
                {suffix}
              </Text>
            </div>
          </Pane>
        </Pane>
      </FormField>
    )
  }
}

export default PrefixInputField
