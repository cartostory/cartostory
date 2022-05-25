import { Link } from 'react-router-dom'
import { useFormSubmit, useTogglePassword } from '../../../hooks'
import { useMutation } from 'react-query'
import { myAxios } from '../../../api'
import { useAuthContext } from '../../../providers/auth-provider'
import React from 'react'
import { Form, Input, Label, Message } from '../../../components'
import type { AxiosError, AxiosResponse } from 'axios'

type FormErrors = MapTo<Credentials, string>

type AuthTokens = {
  data: Pick<ReturnType<typeof useAuthContext>, 'accessToken' | 'refreshToken'>
  status: string
}

function SignIn() {
  const [passwordType, togglePassword] = useTogglePassword()
  const signInMutation = useSignIn()
  const handleSubmit = useFormSubmit<ReturnType<typeof useSignIn>['mutate']>(
    signInMutation.mutate,
  )
  const [errors, validate] = useFormValidation()

  return (
    <Form
      noValidate
      onSubmit={e => {
        e.preventDefault()
        const { email, password } = e.target as typeof e.target &
          MapTo<Credentials, HTMLInputElement>

        if (!validate([email, password])) {
          return
        }

        handleSubmit(e)
      }}
    >
      {signInMutation.error?.response?.data.message ? (
        <Message mode="block" level="error">
          {signInMutation.error.response.data.message}
        </Message>
      ) : null}
      <Label>
        <span className="my-required">E-mail</span>
        <Input
          name="email"
          placeholder="e-mail address"
          required
          type="email"
        />
        {errors.email ? (
          <Message mode="inline" level="error">
            {errors.email}
          </Message>
        ) : null}
      </Label>
      <Label>
        <span className="my-required">Password</span>
        <Input
          name="password"
          placeholder="password"
          required
          type={passwordType}
        />
        {errors.password ? (
          <Message mode="inline" level="error">
            {errors.password}
          </Message>
        ) : null}
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
        disabled={signInMutation.status === 'loading'}
        className="border block w-full py-3 cursor-pointer"
        type="submit"
        value="Sign in"
      />
      <p>
        Don't have an account yet? <Link to="/auth/sign-up">Sign up.</Link>
      </p>
    </Form>
  )
}

function useSignIn() {
  const { login } = useAuthContext()
  const mutation = useMutation<
    AxiosResponse<AuthTokens>,
    AxiosError<ApiError>,
    Credentials
  >(async data => myAxios.post('/auth/sign-in', data), {
    onSuccess: ({ data }) => {
      login(data.data)
    },
  })

  return mutation
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

export { SignIn }
