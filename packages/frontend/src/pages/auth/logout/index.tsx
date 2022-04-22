import React from 'react'
import { useAuthContext } from '../../../providers/auth-provider'

function Logout() {
  useLogout()

  return null
}

function useLogout() {
  const auth = useAuthContext()

  React.useEffect(() => {
    auth.logout()
  }, [auth])
}

export { Logout }
