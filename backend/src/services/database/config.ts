const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env;

export const TABLE_USER = 'user';
export const TABLE_USER_ACTIVATION_CODE = 'user_activation_code';
export const CONNECTION_STRING = `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`;
