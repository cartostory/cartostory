// eslint-disable-next-line import/no-extraneous-dependencies
import pg from 'pg';

const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;
const TABLES = [
  '"user"',
  'user_activation_code',
  'story',
];

const truncate = async () => {
  const pool = new pg.Pool({
    connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`,
  });

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
    await pool.end();
  }
};

export default truncate;
