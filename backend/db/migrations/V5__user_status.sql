CREATE TABLE cartostory.user_status (
    id text PRIMARY KEY
);

INSERT INTO cartostory.user_status (id)
VALUES
('registered'),
('verified'),
('deleted');

ALTER TABLE cartostory."user" ADD COLUMN status text REFERENCES cartostory.user_status(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL DEFAULT 'registered';
