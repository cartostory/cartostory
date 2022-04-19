import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { SignUp } from '../../pages'

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
      <Route path="sign-up" element={<SignUp />} />
      <Route path="sign-in" element={<>sign-in</>} />
    </Route>
    <Route
      path="/stories"
      element={
        <>
          stories: <Outlet />
        </>
      }
    >
      <Route path="write" element={<>write</>} />
      <Route path=":id" element={<>id</>} />
    </Route>
  </Routes>
)

export { MyRoutes }
