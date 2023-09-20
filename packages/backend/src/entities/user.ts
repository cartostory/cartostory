import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'
import { BaseEntity } from './base-entity'
import { UserRepository } from '../services/repositories/user'
import { UserVerificationCode } from './user-verification-code'
import { Story } from './story'
import { UserStatus } from './user-status'

@Entity({ schema: 'cartostory', customRepository: () => UserRepository })
class User extends BaseEntity {
  @Property({ columnType: 'text' })
  displayName!: string

  @Property({ columnType: 'text' })
  @Unique()
  email!: string

  @Property({ columnType: 'text', hidden: true })
  password!: string

  @Property({ onCreate: () => new Date() })
  signedUpAt: Date = new Date()

  @Property({ nullable: true })
  activatedAt?: Date

  @Property({ nullable: true })
  lastLoggedInAt?: Date

  @OneToOne({
    entity: () => UserStatus,
    mapToPk: true,
    fieldName: 'status',
    unique: false,
  })
  status!: 'deleted' | 'registered' | 'verified'

  @OneToMany({ entity: () => UserVerificationCode, mappedBy: 'user' })
  verificationCode: Collection<UserVerificationCode> = new Collection<UserVerificationCode>(
    this,
  )

  @OneToMany({ entity: () => Story, mappedBy: 'user' })
  stories: Collection<Story> = new Collection<Story>(this)
}

export { User }
