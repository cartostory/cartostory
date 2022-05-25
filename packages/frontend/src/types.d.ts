declare global {
  type Maybe<T> = T | undefined

  type ApiError = {
    status: 'error'
    message: string
  }

  type Credentials = {
    email: string
    password: string
  }

  type MapTo<T, U> = {
    [key in keyof T]: U
  }
}

export {}
