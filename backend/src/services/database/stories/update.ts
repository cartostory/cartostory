import type Knex from 'knex';
import type { Story } from '../types';

export const update = (db: Knex) => (slug: string, story: object) => db<Story>('story')
  .update({
    story,
  })
  .where({
    slug,
  });
