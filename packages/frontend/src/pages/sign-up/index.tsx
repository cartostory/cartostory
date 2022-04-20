import type { FormEventHandler } from 'react'
import { useToggle } from '../../hooks'
import { useMutation } from 'react-query'
import axios from 'axios'

const useTogglePassword = (): ['password' | 'text', () => void] => {
  const [isPassword, { toggle: togglePassword }] = useToggle()

  return [isPassword ? 'password' : 'text', togglePassword]
}

const useSignUp = () => {
  const mutation = useMutation(async data =>
    axios.post('/backend/auth/sign-up', data),
  )

  return mutation
}

const SignUp = () => {
  const [passwordType, togglePassword] = useTogglePassword()
  const signUpMutation = useSignUp()

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      email: { value: string }
      password: { value: string }
    }
    const email = target.email.value
    const password = target.password.value
    // @ts-expect-error hello
    signUpMutation.mutate({ email, password })
  }

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
      <input type="submit" value="sign up" />
    </form>
  )
}

export { SignUp }
