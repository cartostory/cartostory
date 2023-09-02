class ReadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReadError'
  }
}

export { ReadError }
