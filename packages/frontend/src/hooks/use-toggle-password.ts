import { useToggle } from './use-toggle'

function useTogglePassword(): ['password' | 'text', () => void] {
  const [isPassword, { toggle: togglePassword }] = useToggle()

  return [isPassword ? 'password' : 'text', togglePassword]
}

export { useTogglePassword }
