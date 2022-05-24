declare global {
  type Maybe<T> = T | undefined

  type ApiError = {
    status: 'error'
    message: string
  }
}

export {}
