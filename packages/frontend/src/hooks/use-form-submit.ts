import type { FormEventHandler } from 'react'

function useFormSubmit<OnSubmit extends Function>(onSubmit: OnSubmit) {
  const handler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const target = e.target as typeof e.target &
      MapTo<Credentials, { value: string }>
    const email = target.email.value
    const password = target.password.value

    return onSubmit({ email, password })
  }

  return handler
}

export { useFormSubmit }
