import knex from 'knex';
import { CONNECTION_STRING } from './config';

export const db = knex({
  client: 'pg',
  connection: CONNECTION_STRING,
});
