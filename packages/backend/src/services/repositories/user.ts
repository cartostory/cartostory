import { EntityRepository } from '@mikro-orm/postgresql'
import type { User } from '../../entities/user'

class UserRepository extends EntityRepository<User> {}

export { UserRepository }
