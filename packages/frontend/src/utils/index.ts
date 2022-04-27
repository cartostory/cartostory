function randomString(length: number) {
  return (Math.random() + 1).toString(36).substring(length)
}

export { randomString }
