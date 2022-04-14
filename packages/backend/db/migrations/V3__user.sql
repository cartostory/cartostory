CREATE TABLE cartostory.user (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    display_name text NOT NULL,
    password text NOT NULL,
    signup_date timestamp(0) without time zone NOT NULL DEFAULT now(),
    activation_date timestamp(0) without time zone,
    last_login_date timestamp(0) without time zone
);
