CREATE TABLE cartostory.user_activation_code (
    user_id uuid references cartostory."user" ON DELETE CASCADE ON UPDATE CASCADE,
    activation_code text UNIQUE NOT NULL,
    generated_date timestamp(0) without time zone DEFAULT now(),
    valid_until_date timestamp(0) without time zone DEFAULT now() + '1 day',
    used_date timestamp(0) without time zone
);

ALTER TABLE cartostory.user_activation_code ADD CONSTRAINT user_activation_code_pk PRIMARY KEY (user_id, activation_code);
