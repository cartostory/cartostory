import { LoadStrategy, defineConfig } from '@mikro-orm/core'
import { User } from './src/entities/user'
import { UserVerificationCode } from './src/entities/user-verification-code'
import { Story } from './src/entities/story'
import { UserStatus } from './src/entities/user-status'

const options = defineConfig({
  migrations: {
    emit: 'js',
    tableName: 'mikro_orm_migrations',
    path: './db/migrations',
    allOrNothing: true,
    transactional: true,
  },
  schemaGenerator: {
    ignoreSchema: ['cron'],
  },
  entities: [Story, User, UserStatus, UserVerificationCode],
  entitiesTs: [Story, User, UserStatus, UserVerificationCode],
  debug: process.env.NODE_ENV !== 'prod',
  host: 'database',
  dbName: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASS,
  user: process.env.POSTGRES_USER,
  type: 'postgresql',
  loadStrategy: LoadStrategy.JOINED,
})

export default options
