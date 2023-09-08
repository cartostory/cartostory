import { LoadStrategy, defineConfig } from '@mikro-orm/core'
import { User } from './src/entities/user'
import { UserStatus } from './src/entities/user-status'
import { UserVerificationCode } from './src/entities/user-verification-code'

export default defineConfig({
  entities: [User, UserStatus, UserVerificationCode],
  entitiesTs: [User, UserStatus, UserVerificationCode],
  debug: process.env.NODE_ENV !== 'prod',
  host: 'database',
  dbName: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASS,
  user: process.env.POSTGRES_USER,
  type: 'postgresql',
  loadStrategy: LoadStrategy.JOINED,
})
