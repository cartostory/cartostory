import React from 'react'
import { useLocalStorage } from '../hooks'

type Context = {
  accessToken?: string
  refreshToken?: string
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

const AuthProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [auth, login, logout] =
    useLocalStorage<Pick<Context, 'accessToken' | 'refreshToken'>>('auth')

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, useAuthContext }
