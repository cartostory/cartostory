ALTER TABLE cartostory.user ADD COLUMN created_at timestamp(0) without time zone NOT NULL DEFAULT now();
ALTER TABLE cartostory.user ADD COLUMN updated_at timestamp(0) without time zone NOT NULL DEFAULT now();
ALTER TABLE cartostory.user RENAME COLUMN activation_date TO activated_at;
ALTER TABLE cartostory.user RENAME COLUMN last_login_date TO last_logged_in_at;
ALTER TABLE cartostory.user RENAME COLUMN signup_date TO signed_up_at;
