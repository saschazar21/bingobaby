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
CREATE TABLE IF NOT EXISTS users (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS browsers (
    user_agent TEXT PRIMARY KEY,
    name TEXT,
    version TEXT,
    device TEXT,
    os TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    name TEXT REFERENCES users(name) ON DELETE CASCADE,
    error TEXT,
    active BOOLEAN DEFAULT true,
    browser TEXT REFERENCES browsers(user_agent) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS guesses (
    id TEXT PRIMARY KEY,
    name TEXT REFERENCES users(name) ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    sex sex NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE
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

/*
Function and trigger for expire old sessions
*/
CREATE OR REPLACE FUNCTION expire_old_sessions() RETURNS TRIGGER AS $$
BEGIN
    UPDATE sessions SET active = false, updated_at = NOW() WHERE created_at < NOW() - INTERVAL '1 week';
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER expire_old_sessions_trigger
    AFTER INSERT ON sessions
    EXECUTE PROCEDURE expire_old_sessions();