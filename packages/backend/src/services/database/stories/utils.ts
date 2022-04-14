import type Knex from 'knex'
import type { Story } from '../types'

export const getUserId = (db: Knex) => async (slug: string) =>
  db<Story>('story').select('user_id').where({ slug })
