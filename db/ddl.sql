CREATE TABLE IF NOT EXISTS User (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    stocks INT,
    funds FLOAT,
    UNIQUE(email)
);
