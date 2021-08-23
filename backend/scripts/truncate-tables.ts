// eslint-disable-next-line import/no-extraneous-dependencies
import pg from 'pg';
import { connectionString } from '../src/services/database';

const TABLES = [
  '"user"',
  'user_activation_code',
  'story',
];

const pool = new pg.Pool({
  connectionString,
});

const truncate = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const promises = TABLES.map((table) => client.query(`TRUNCATE ${table} CASCADE`));
    await Promise.all(promises);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default truncate;
