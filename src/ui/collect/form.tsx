import * as React from 'react'
import { Button, TextInputField, majorScale } from '@treygriffith/evergreen-ui'
import PrefixInputField from '../prefix-input-field'
import { Authorization, CollectField } from '@xkit-co/xkit.js'
import withXkit, { XkitConsumer } from '../with-xkit'
import { toaster } from '../toaster'
import { errorMessage } from '../../util'

interface FormProps {
  authorization: Authorization
  onComplete: (authorization: Authorization) => void
}

interface FormState {
  saving: boolean
  values: { [name: string]: string | null }
  validationMessages: { [name: string]: string | null }
}

class Form extends React.Component<XkitConsumer<FormProps>, FormState> {
  constructor(props: XkitConsumer<FormProps>) {
    super(props)

    this.state = {
      saving: false,
      values: {},
      validationMessages: {}
    }
  }

  private collectFields(): CollectField[] {
    const {
      authorization: {
        authorizer: { prototype }
      }
    } = this.props

    if ((prototype.collect_fields || []).length > 0) {
      return prototype.collect_fields
    } else {
      return [
        {
          name: prototype.collect_field,
          label: prototype.collect_label || '',
          suffix: prototype.collect_suffix
        }
      ]
    }
  }

  private saveLabel(): string {
    return this.props.authorization.authorizer.prototype.collect_save || 'Save'
  }

  private validateFields(): boolean {
    const { values, validationMessages } = this.state

    let validationSuccess = true

    this.collectFields().forEach((field) => {
      const value = values[field.name]
      if (value) {
        validationMessages[field.name] = null
      } else {
        validationMessages[field.name] = 'cannot be blank'
        validationSuccess = false
      }
    })

    this.setState({ validationMessages })

    return validationSuccess
  }

  handleSave = async (e: React.SyntheticEvent<HTMLElement>): Promise<void> => {
    const { xkit, authorization, onComplete } = this.props
    const { values } = this.state
    e.preventDefault()

    if (!this.validateFields()) {
      return
    }

    this.setState({ saving: true })

    try {
      const {
        state,
        authorizer: {
          prototype: { slug, collect_field: collectField }
        }
      } = authorization

      if (!state || !collectField) {
        throw new Error('Authorization not yet loaded')
      }
      const updatedAuthorization = await xkit.setAuthorizationFields(
        slug,
        state,
        values
      )
      onComplete(updatedAuthorization)
    } catch (e) {
      const collectFields = this.collectFields()
      const error =
        collectFields.length > 1 || !collectFields[0].label
          ? ''
          : ' ' + collectFields[0].label
      toaster.danger(`Error while saving${error}: ${errorMessage(e)}`)
      this.setState({ saving: false })
    }
  }

  renderFields(): React.ReactNode {
    const { saving, values, validationMessages } = this.state

    return this.collectFields().map((collectField) => {
      const name = collectField.name
      const validationMessage = validationMessages[name]

      const inputProps = {
        label: collectField.label,
        value: values[name] || '',
        isInvalid: Boolean(validationMessage),
        validationMessage: validationMessage
          ? `${collectField.label} ${validationMessage}`
          : undefined,
        disabled: saving,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          this.setState({ values: { ...values, [name]: e.target.value } }),
        onKeyDown: async (e: React.KeyboardEvent<HTMLInputElement>) =>
          e.keyCode === 13 ? await this.handleSave(e) : null
      }

      if (collectField.suffix) {
        return (
          <PrefixInputField
            key={collectField.name}
            suffix={collectField.suffix}
            {...inputProps}
          />
        )
      }

      return <TextInputField key={collectField.name} {...inputProps} />
    })
  }

  render(): React.ReactElement {
    const { saving } = this.state

    return (
      <form>
        {this.renderFields()}
        <Button
          appearance='primary'
          isLoading={saving}
          onClick={this.handleSave}
          justifyContent='center'
          height={majorScale(5)}
          width='100%'
        >
          {saving ? 'Saving' : this.saveLabel()}
        </Button>
      </form>
    )
  }
}

export default withXkit(Form)
