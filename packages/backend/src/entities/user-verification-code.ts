import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core'
import { User } from './user'

@Entity()
class UserVerificationCode {
  @ManyToOne({ entity: () => User, primary: true })
  user!: User

  @PrimaryKey()
  @Property()
  verificationCode!: string;

  [PrimaryKeyType]?: [string, string]

  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  @Property({
    onCreate: () => {
      const today = new Date()
      today.setDate(today.getDate() + 1)
      return today
    },
  })
  expiresAt!: Date

  @Property({ nullable: true })
  usedAt?: Date
}

export { UserVerificationCode }
