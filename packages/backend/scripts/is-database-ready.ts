import query, { shutdown } from './query';

const check = async (): Promise<void> => {
  process.stdout.write('checking flyway migration status... \n');
  try {
    const result = await query('SELECT 1 FROM pg_tables WHERE tablename = $1', [
      'flyway_migration_in_progress',
    ]);

    if (result.rowCount === 1) {
      setTimeout(async () => check(), 1000);
    } else {
      await shutdown();
      process.exit(0);
    }
  } catch (e) {
    setTimeout(async () => check(), 1000);
  }
};

check().catch(() => {
  // TODO handle error
});
