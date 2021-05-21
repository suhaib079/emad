CREATE TABLE IF NOT EXISTS food(
    id SERIAL PRIMARY KEY,
    character VARCHAR(255),
    image TEXT,
    quote VARCHAR(255),
    characterDirection VARCHAR(255)
)