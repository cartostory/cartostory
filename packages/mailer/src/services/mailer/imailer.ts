import type { ISender } from './isender'
import type { TemplateReader } from './template-reader'

interface IMailer {
  readonly templateReader: TemplateReader
  readonly sender: ISender
  sendSignup(to: string, userId: string, activationCode: string): Promise<void>
}

export type { IMailer }
