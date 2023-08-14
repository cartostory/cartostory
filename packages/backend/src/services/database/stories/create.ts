import type { Knex } from 'knex'
import type { Story } from '../types'

export const create =
  (db: Knex) => async (userId: string, slug: string, story: object) => {
    const createdStory = await db<Story>('story')
      .insert({
        user_id: userId,
        slug,
        story,
      })
      .returning('id')

    return createdStory[0].id
  }
