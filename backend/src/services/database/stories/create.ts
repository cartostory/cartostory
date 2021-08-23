import type Knex from 'knex';
import type { Story } from '../types';

export const create = (db: Knex) => async (userId: string, slug: string, story: object) => db<Story>('story').insert({
  user_id: userId,
  slug,
  story,
}).returning('id');
