import query from './query';

const check = async (): Promise<void> => {
  process.stdout.write('checking flyway migration status... \n');
  try {
    const result = await query('SELECT 1 FROM pg_tables WHERE tablename = $1', ['flyway_migration_in_progress']);

    if (result.rowCount === 1) {
      setTimeout(() => check(), 1000);
    } else {
      process.exit(0);
    }
  } catch (e) {
    setTimeout(() => check(), 1000);
  }
};

check();
