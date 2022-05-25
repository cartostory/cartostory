import { useFormSubmit, useTogglePassword } from '../../../hooks'
import { useMutation } from 'react-query'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { Form, Input, Label } from '../../../components'
import { Link } from 'react-router-dom'

function SignUp() {
  const [passwordType, togglePassword] = useTogglePassword()
  const signUpMutation = useSignUp()
  const handleSubmit = useFormSubmit<ReturnType<typeof useSignUp>['mutate']>(
    signUpMutation.mutate,
  )

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        <span className="my-required">E-mail</span>
        <Input
          name="email"
          placeholder="e-mail address"
          required
          type="email"
        />
      </Label>
      <Label>
        <span className="my-required">Password</span>
        <Input
          name="password"
          placeholder="password"
          required
          type={passwordType}
        />
      </Label>
      <Label className="space-x-3 mt-3 cursor-pointer">
        <input onChange={togglePassword} type="checkbox" />
        <span>show password</span>
      </Label>
      <input
        className="border block w-full py-3 cursor-pointer"
        disabled={signUpMutation.status === 'loading'}
        type="submit"
        value="Sign up"
      />
      <p>
        Already have an account? <Link to="/auth/sign-in">Sign in.</Link>
      </p>
    </Form>
  )
}

function useSignUp() {
  const mutation = useMutation<void, AxiosError<ApiError>, Credentials>(
    async data => axios.post('/backend/auth/sign-up', data),
  )

  return mutation
}

export { SignUp }
