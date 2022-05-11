import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Home, Logout, SignIn, SignUp, Write } from '../../pages'
import { useAuthContext } from '../../providers/auth-provider'

const RequireAuthenticated = ({
  children,
  redirectTo = '/auth/sign-in',
}: React.PropsWithChildren<{ redirectTo?: string }>): JSX.Element => {
  const hook = useAuthContext()

  if (!hook.user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

const RequireAnonymous = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const hook = useAuthContext()

  if (hook.user) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

const MyRoutes = (): React.ReactElement => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/auth"
      element={
        <>
          auth: <Outlet />
        </>
      }
    >
      <Route path="me" element={<>me</>} />
      <Route
        path="logout"
        element={
          <RequireAuthenticated redirectTo="/">
            <Logout />
          </RequireAuthenticated>
        }
      />
      <Route
        path="sign-up"
        element={
          <RequireAnonymous>
            <SignUp />
          </RequireAnonymous>
        }
      />
      <Route
        path="sign-in"
        element={
          <RequireAnonymous>
            <SignIn />
          </RequireAnonymous>
        }
      />
    </Route>
    <Route
      path="/stories"
      element={
        //<RequireAuthenticated>
        <Outlet />
        //</RequireAuthenticated>
      }
    >
      <Route
        path="write"
        element={
          //<RequireAuthenticated>
          <Write />
          //</RequireAuthenticated>
        }
      />
      <Route path=":id" element={<>id</>} />
    </Route>
  </Routes>
)

export { MyRoutes }
