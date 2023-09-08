import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core'
import { BaseEntity } from './base-entity'
import { UserStatus } from './user-status'
import { UserRepository } from '../services/repositories/user'
import { UserVerificationCode } from './user-verification-code'

@Entity({ customRepository: () => UserRepository })
class User extends BaseEntity {
  @Property()
  displayName!: string

  @Property()
  @Unique()
  email!: string

  @Property({ hidden: true })
  password!: string

  @Property({ onCreate: () => new Date() })
  signedUpAt: Date = new Date()

  @Property({ nullable: true })
  activatedAt?: Date

  @Property({ nullable: true })
  lastLoggedInAt?: Date

  @OneToOne({ onCreate: () => 'registered', fieldName: 'status' })
  status!: UserStatus

  @OneToMany({ entity: () => UserVerificationCode, mappedBy: 'user' })
  verificationCode: Collection<UserVerificationCode> = new Collection<UserVerificationCode>(
    this,
  )
}

export { User }
