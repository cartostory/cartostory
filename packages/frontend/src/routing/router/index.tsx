import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SignIn, SignUp, Write } from '../../pages'
import { useAuthContext } from '../../providers/auth-provider'

const RequireAuth = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const hook = useAuthContext()

  if (!hook.accessToken) {
    return <Navigate to="/auth/sign-in" />
  }

  return <>{children}</>
}

const RequireAnonymous = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const hook = useAuthContext()

  if (hook.accessToken) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

const MyRoutes = (): React.ReactElement => (
  <Routes>
    <Route path="/" element={<>/</>} />
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
        <RequireAuth>
          <Outlet />
        </RequireAuth>
      }
    >
      <Route
        path="write"
        element={
          <RequireAuth>
            <Write />
          </RequireAuth>
        }
      />
      <Route path=":id" element={<>id</>} />
    </Route>
  </Routes>
)

export { MyRoutes }
