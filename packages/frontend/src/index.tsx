import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { MyRoutes } from './routing'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './providers/auth-provider'

const container = document.getElementById('root')
const root = createRoot(container!)
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
