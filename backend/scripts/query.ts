import pg from 'pg';
import { connectionString } from '../src/services/database';

const pool = new pg.Pool({
  connectionString,
});

const query = async (sql: string, params?: any[]) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = params ? await client.query(sql, params) : await client.query(sql);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const shutdown = async () => pool.end();

export default query;
