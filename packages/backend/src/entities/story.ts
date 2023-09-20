import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from './base-entity'
import { User } from './user'

@Entity({ schema: 'cartostory' })
class Story extends BaseEntity {
  @Property({ columnType: 'text' })
  slug!: string

  @Property({ type: 'jsonb' })
  story!: Record<string, unknown>

  @ManyToOne({ entity: () => User })
  user!: User
}

export { Story }
