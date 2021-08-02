// eslint-disable-next-line import/no-extraneous-dependencies
import pg from 'pg';

const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;

const query = async (sql: string, params: any[]) => {
  const pool = new pg.Pool({
    connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`,
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql, params);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
};

export default query;
