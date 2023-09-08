import { MikroORM } from '@mikro-orm/core'
import type { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { InjectionMode, asClass, asValue, createContainer } from 'awilix'
import { User } from './entities/user'
import { UserController } from './api/user/controller'
import type { UserRepository } from './services/repositories/user'
import { UserUtils } from './services/utils/user'

type Registrations = {
  orm: Awaited<ReturnType<typeof createEntityManager>>
  userController: UserController
  userRepository: UserRepository
  userUtils: UserUtils
}

const container = createContainer<Registrations>({
  injectionMode: InjectionMode.PROXY,
})

const createEntityManager = async () => {
  return await MikroORM.init<PostgreSqlDriver>()
}

const _bootstrap = async (mode: 'prod' | 'dev') => {
  const orm = await createEntityManager()
  container
    .register({
      orm: asValue(orm),
    })
    .register({
      userController: asClass(UserController),
    })
    .register({
      userRepository: asValue(orm.em.getRepository(User)),
    })
    .register({
      userUtils: asClass(UserUtils),
    })

  return container
}

export { _bootstrap, container }
