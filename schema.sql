/*
Create types if not exist
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex') THEN
    CREATE TYPE sex AS ENUM ('female', 'male');
  END IF;
END$$;


/*
Create tables if not exist
*/
CREATE TABLE users IF NOT EXISTS (
    name TEXT PRIMARY KEY
);

CREATE TABLE browsers IF NOT EXISTS (
    user_agent TEXT PRIMARY KEY,
    name TEXT,
    version TEXT,
    device TEXT,
    os TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE sessions IF NOT EXISTS (
    id TEXT PRIMARY KEY,
    name TEXT REFERENCES users(name) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    browser TEXT REFERENCES browsers(user_agent) ON DELETE SET NULL,
    flash TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE guesses (
    id TEXT PRIMARY KEY,
    name TEXT REFERENCES users(name) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    sex sex NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
);


/*
Create extensions if not exist
*/
CREATE EXTENSION IF NOT EXISTS pg_trgm;


/*
Function and trigger for setting updated_at as default value for created_at in sessions and guesses
*/
CREATE OR REPLACE FUNCTION set_default_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NEW.created_at;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_sessions_updated_at_trigger
    BEFORE INSERT ON sessions
    FOR EACH ROW
    WHEN (NEW.updated_at IS NULL)
    EXECUTE FUNCTION set_default_updated_at();

CREATE TRIGGER set_default_guesses_updated_at_trigger
    BEFORE INSERT ON guesses
    FOR EACH ROW
    WHEN (NEW.updated_at IS NULL)
    EXECUTE FUNCTION set_default_updated_at();