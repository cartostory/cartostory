interface ISender {
  send(to: string, message: { text: string; subject: string }): Promise<void>
}

export type { ISender }
