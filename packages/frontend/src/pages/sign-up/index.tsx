import type { FormEventHandler } from 'react'
import { useToggle } from '../../hooks'

const useTogglePassword = (): [boolean, () => void] => {
  const [isPassword, { toggle: togglePassword }] = useToggle()

  return [isPassword, togglePassword]
}

const SignUp = () => {
  const [isPassword, togglePassword] = useTogglePassword()

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input required type="email" placeholder="e-mail address" />
      <input
        required
        type={isPassword ? 'password' : 'text'}
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
