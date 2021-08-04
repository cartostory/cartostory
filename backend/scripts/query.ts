// eslint-disable-next-line import/no-extraneous-dependencies
import pg from 'pg';

const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;
const pool = new pg.Pool({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`,
});

const query = async (sql: string, params: any[]) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query(sql, params);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default query;
