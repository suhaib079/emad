CREATE TABLE IF NOT EXISTS harry(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
   image TEXT,
    house VARCHAR(255),
    alive boolean NOT NULL DEFAULT true

)