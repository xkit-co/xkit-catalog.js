import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Button,
  TextInputField,
  majorScale
} from '@treygriffith/evergreen-ui'
import { Authorization } from '@xkit-co/xkit.js/lib/api/authorization'
import withXkit, { XkitConsumer } from '../with-xkit'
import { toaster } from '../toaster'

interface FormProps {
  authorization: Authorization,
  onComplete: (authorization: Authorization) => void
}

interface FormState {
  saving: boolean,
  value: string,
  validationMessage?: string
}

class Form extends React.Component<XkitConsumer<FormProps>, FormState> {
  constructor (props: XkitConsumer<FormProps>) {
    super(props)
    this.state = {
      saving: false,
      value: ''
    }
  }

  private label (): string {
    return this.props.authorization.authorizer.prototype.collect_label || ''
  }

  private validateFields (): boolean {
    const { value } = this.state

    if (!value) {
      this.setState({
        validationMessage: "cannot be blank"
      })
      return false
    }
    return true
  }

  handleSave = async (e: React.SyntheticEvent<HTMLElement>): Promise<void> => {
    const {
      xkit,
      authorization,
      onComplete
    } = this.props
    const { value } = this.state
    e.preventDefault()

    if (!this.validateFields()) {
      return
    }

    this.setState({ saving: true })

    try {
      const {
        state,
        authorizer: {
          prototype: {
            slug,
            collect_field
          }
        }
      } = authorization

      if (!state || !collect_field) {
        throw new Error(`Authorization not yet loaded`)
      }
      const updatedAuthorization = await xkit.setAuthorizationField(slug, state, { [collect_field]: value })
      onComplete(updatedAuthorization)
    } catch (e) {
      toaster.danger(`Error while saving ${this.label()}: ${e.message}`)
      this.setState({ saving: false })
    }
  }

  render () {
    const {
      saving,
      validationMessage
    } = this.state

    return (
      <form>
        <TextInputField
          label={this.label()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ value: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode === 13 ? this.handleSave(e) : null}
          isInvalid={Boolean(validationMessage)}
          validationMessage={validationMessage ? `${this.label()} ${validationMessage}` :  undefined}
          disabled={saving}
        />
        <Button
          appearance="primary"
          isLoading={saving}
          onClick={this.handleSave}
          justifyContent="center"
          height={majorScale(5)}
          width="100%"
        >
          {saving ? 'Saving' : 'Save'}
        </Button>
      </form>
    )
  }
}

export default withXkit(Form)
