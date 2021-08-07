const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;

export const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`;
