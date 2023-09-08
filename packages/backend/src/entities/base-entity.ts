import { PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

abstract class BaseEntity {
  @PrimaryKey()
  id: string = v4()

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date = new Date()
}

export { BaseEntity }
