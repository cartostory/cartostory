import type { FormEventHandler } from 'react'
import { useToggle } from '../../../hooks'
import { useMutation } from 'react-query'
import { myAxios } from '../../../api'
import { useAuthContext } from '../../../providers/auth-provider'

type Credentials = {
  email: string
  password: string
}

type FormCredentials = {
  [key in keyof Credentials]: { value: Credentials[key] }
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

const SignIn = () => {
  const [passwordType, togglePassword] = useTogglePassword()
  const signInMutation = useSignIn()
  const handleSubmit = useFormSubmit(signInMutation.mutate)

  return (
    <form onSubmit={handleSubmit}>
      <input
        autoComplete="off"
        name="email"
        required
        type="email"
        placeholder="e-mail address"
      />
      <input
        autoComplete="off"
        name="password"
        required
        type={passwordType}
        placeholder="password"
      />
      <label>
        show password
        <input onChange={() => togglePassword()} type="checkbox" />
      </label>
      <input type="submit" value="sign in" />
    </form>
  )
}

export { SignIn }
