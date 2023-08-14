import type { Knex } from 'knex'
import type { Story } from '../types'

export const readOne = (db: Knex) => (userId: string, slug: string) =>
  db<Story>('story').select('*').where({
    user_id: userId,
    slug,
  })

export const readAll = (db: Knex) => (userId: string) =>
  db<Story>('story').select('*').where({
    user_id: userId,
  })
