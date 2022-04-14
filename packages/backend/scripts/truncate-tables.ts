import query from './query';

const TABLES = ['"user"', 'user_activation_code', 'story'];

const truncate = async () => {
  const promises = TABLES.map(table => query(`TRUNCATE ${table} CASCADE`));
  await Promise.all(promises);
};

export default truncate;
