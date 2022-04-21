import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { MyRoutes } from './routing'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './providers/auth-provider'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
