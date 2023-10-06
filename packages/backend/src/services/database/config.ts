const { POSTGRES_DB, POSTGRES_PASS, POSTGRES_USER } = process.env

export const TABLE_USER = 'user'
export const TABLE_USER_VERIFICATION_CODE = 'user_verification_code'
export const CONNECTION_STRING = `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@database/${POSTGRES_DB}`
