import React from 'react'
import jwtDecode from 'jwt-decode'
import { useLocalStorage } from '../hooks'

type Context = {
  accessToken?: string
  refreshToken?: string
  user?: {
    display_name: string
    status: 'registered' | 'verified' | 'deleted'
  }
  login: React.Dispatch<
    React.SetStateAction<Pick<Context, 'accessToken' | 'refreshToken'>>
  >
  logout: () => void
}

const AuthContext = React.createContext<Context | null>(null)

const useAuthContext = () => {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('TokenContext is only available inside TokenProvider.')
  }

  return context
}

function AuthProvider({ children }: React.PropsWithChildren<unknown>) {
  const [auth, login, logout] =
    useLocalStorage<Pick<Context, 'accessToken' | 'refreshToken'>>('auth')
  const jwtUser = auth?.accessToken
    ? jwtDecode<Context['user']>(auth.accessToken)
    : undefined

  console.log('jwtUser', jwtUser)

  return (
    <AuthContext.Provider value={{ ...auth, user: jwtUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuthContext }
