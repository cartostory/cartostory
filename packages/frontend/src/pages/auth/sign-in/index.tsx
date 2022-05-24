import type { FormEventHandler } from 'react'
import { useToggle } from '../../../hooks'
import { useMutation } from 'react-query'
import { myAxios } from '../../../api'
import { useAuthContext } from '../../../providers/auth-provider'
import React from 'react'
import { Form, Input, Label } from '../../../components'

type Credentials = {
  email: string
  password: string
}

type FormCredentials = {
  [key in keyof Credentials]: { value: Credentials[key] }
}

type FormErrors = {
  [key in keyof Credentials]: string
}

type AuthTokens = {
  data: Pick<ReturnType<typeof useAuthContext>, 'accessToken' | 'refreshToken'>
  status: string
}

const useTogglePassword = (): ['password' | 'text', () => void] => {
  const [isPassword, { toggle: togglePassword }] = useToggle()

  return [isPassword ? 'password' : 'text', togglePassword]
}

const useSignIn = () => {
  const { login } = useAuthContext()
  const mutation = useMutation(
    async (data: Credentials) =>
      myAxios.post<AuthTokens>('/auth/sign-in', data),
    {
      onSuccess: ({ data }) => {
        login(data.data)
      },
    },
  )

  return mutation
}

const useFormSubmit = (onSubmit: ReturnType<typeof useSignIn>['mutate']) => {
  const handler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const target = e.target as typeof e.target & FormCredentials
    const email = target.email.value
    const password = target.password.value

    return onSubmit({ email, password })
  }

  return handler
}

function useFormValidation(): [
  FormErrors,
  (elements: HTMLInputElement[]) => boolean,
] {
  const [errors, setErrors] = React.useState<FormErrors>({} as FormErrors)

  /**
   * TODO reconsider whether validate should return the result
   */
  const validate = (elements: HTMLInputElement[]) => {
    const result = elements.reduce((prev, cur) => {
      if (cur.validity.valid) {
        return prev
      }

      return {
        ...prev,
        [cur.name]: cur.validationMessage,
      }
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as FormErrors)

    setErrors(result)

    return Object.keys(result).length === 0
  }

  return [errors, validate]
}

function SignIn() {
  const [passwordType, togglePassword] = useTogglePassword()
  const signInMutation = useSignIn()
  const handleSubmit = useFormSubmit(signInMutation.mutate)
  const [errors, validate] = useFormValidation()

  return (
    <Form
      noValidate
      onSubmit={e => {
        e.preventDefault()
        const form = e.target as {
          email: HTMLInputElement
          password: HTMLInputElement
        } & typeof e.target

        if (!validate([form.email, form.password])) {
          return
        }

        handleSubmit(e)
      }}
    >
      <Label>
        <span className="my-required">E-mail</span>
        <Input
          name="email"
          placeholder="e-mail address"
          required
          type="email"
        />
        {errors.email ? <small>{errors.email}</small> : null}
      </Label>
      <Label>
        <span className="my-required">Password</span>
        <Input
          name="password"
          placeholder="password"
          required
          type={passwordType}
        />
        {errors.password ? <small>{errors.password}</small> : null}
      </Label>
      <Label className="space-x-3 mt-3 cursor-pointer">
        <input
          onChange={togglePassword}
          type="checkbox"
          className="cursor-pointer"
        />
        <span>show password</span>
      </Label>
      <input
        className="border block w-full py-3 cursor-pointer"
        type="submit"
        value="sign in"
      />
    </Form>
  )
}

export { SignIn }
