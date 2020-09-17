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
  authorizer: Authorization,
  label: string,
  description: string,
  placeholder?: string,
  onComplete: Function
}

interface FormState {
  saving: boolean,
  key: string,
  validationMessage?: string
}

class APIKeyForm extends React.Component<XkitConsumer<FormProps>, FormState> {
  constructor (props: XkitConsumer<FormProps>) {
    super(props)
    this.state = {
      saving: false,
      key: ''
    }
  }

  private validateFields (): boolean {
    const { key } = this.state

    if (!key) {
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
      label,
      authorization,
      onComplete
    } = this.props
    const { key } = this.state
    e.preventDefault()

    if (!this.validateFields()) {
      return
    }

    this.setState({ saving: true })

    try {
      await xkit.setAuthorizationAPIKey(authorization.authorizer.prototype.slug, authorization.state, key)
      onComplete()
    } catch (e) {
      toaster.danger(`Error while saving ${label}: ${e.message}`)
      this.setState({ saving: false })
    }
  }

  render () {
    const {
      saving,
      validationMessage
    } = this.state
    const {
      label,
      description,
      placeholder
    } = this.props

    return (
      <form>
        <TextInputField
          label={label}
          description={description}
          placeholder={placeholder || 'sk_asdofij12987'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ key: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode === 13 ? this.handleSave(e) : null}
          isInvalid={Boolean(validationMessage)}
          validationMessage={validationMessage ? `${label} ${validationMessage}` :  undefined}
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

export default withXkit(APIKeyForm)
