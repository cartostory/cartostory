CREATE TABLE cartostory.story (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  user_id uuid references cartostory.user (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
  story jsonb NOT NULL,
  created_date timestamp(0) without time zone default now() NOT NULL
);
