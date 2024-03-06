import { SESSIONS } from "../types.d.ts";

export const ALL_SESSIONS = `
SELECT * FROM ${SESSIONS} ORDER BY ${SESSIONS}.created_at DESC;
`;

export const SESSION_BY_ID = `
SELECT id, name FROM ${SESSIONS} WHERE ${SESSIONS}.id = $1 AND ${SESSIONS}.active = true;
`;

export const CREATE_SESSION = `
INSERT INTO ${SESSIONS}
SET (id, name, browser)
VALUES ($1, $2, $3)
RETURNING id;
`;

export const EXPIRE_SESSION_BY_ID = `
UPDATE ${SESSIONS} SET active = false, updated_at = NOW() WHERE ${SESSIONS}.id = $1 RETURNING id;
`;
