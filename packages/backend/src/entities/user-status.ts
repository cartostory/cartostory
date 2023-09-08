import { Entity, OneToOne, PrimaryKey } from '@mikro-orm/core'
import { User } from './user'

@Entity()
class UserStatus {
  @PrimaryKey()
  id!: 'registered' | 'verified' | 'deleted'

  @OneToOne({ entity: () => User })
  user!: User
}

export { UserStatus }
