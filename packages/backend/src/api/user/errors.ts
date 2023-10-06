class ApiError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

class InvalidEmailError extends ApiError {
  constructor() {
    super('invalid e-mail address', 422)
    this.name = 'InvalidEmailError'
  }
}

class UserNotFoundError extends ApiError {
  constructor() {
    super('user not found', 400)
    this.name = 'UserNotFoundError'
  }
}

class UserVerificationError extends ApiError {
  constructor(message: string = 'user cannot be verified') {
    super(message, 400)
    this.name = 'UserVerificationError'
  }
}

class BadPasswordError extends ApiError {
  constructor() {
    super('bad password', 401)
    this.name = 'BadPasswordEmailError'
  }
}

export {
  ApiError,
  BadPasswordError,
  InvalidEmailError,
  UserNotFoundError,
  UserVerificationError,
}
