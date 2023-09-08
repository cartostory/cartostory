ALTER TABLE cartostory.user_activation_code RENAME TO user_verification_code;
ALTER TABLE cartostory.user_verification_code RENAME COLUMN activation_code TO verification_code;
ALTER TABLE cartostory.user_verification_code RENAME COLUMN generated_date TO created_at;
ALTER TABLE cartostory.user_verification_code RENAME COLUMN valid_until_date TO expires_at;
ALTER TABLE cartostory.user_verification_code RENAME COLUMN used_date TO used_at;
