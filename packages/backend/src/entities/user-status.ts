import { Entity, Enum, PrimaryKey } from '@mikro-orm/core'

enum Status {
  Registered = 'registered',
  Verified = 'verified',
  Deleted = 'deleted',
}

@Entity()
class UserStatus {
  @PrimaryKey({ type: 'text' })
  @Enum(() => Status)
  status!: string
}

export { UserStatus }
