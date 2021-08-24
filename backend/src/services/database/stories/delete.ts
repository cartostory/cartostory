import type Knex from 'knex';
import type { Story } from '../types';

export const remove = (db: Knex) => async (slug: string) => db<Story>('story').delete().where({ slug });
