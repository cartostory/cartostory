import { Link } from 'react-router-dom'
import {
  useFormSubmit,
  useFormValidation,
  useTogglePassword,
} from '../../../hooks'
import { useMutation } from 'react-query'
import { myAxios } from '../../../api'
import { useAuthContext } from '../../../providers/auth-provider'
import { Form, Input, Label, Message } from '../../../components'
import type { AxiosError, AxiosResponse } from 'axios'

type AuthTokens = {
  data: Pick<ReturnType<typeof useAuthContext>, 'accessToken' | 'refreshToken'>
  status: string
}

function SignIn() {
  const [passwordType, togglePassword] = useTogglePassword()
  const signInMutation = useSignIn()
  const handleSubmit = useFormSubmit(signInMutation.mutate)
  const [errors, validate] = useFormValidation<keyof Credentials>()

  return (
    <Form
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
  // TODO check if useQuery wouldn't be enough
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

export { SignIn }
