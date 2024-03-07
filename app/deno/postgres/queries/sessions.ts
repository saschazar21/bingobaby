import { SESSIONS } from "../types.d.ts";

export interface Session {
  id: string;
  name?: string;
  error?: string;
  active: boolean;
  browser?: string;
  created_at: string;
  updated_at: string;
}

export const ALL_SESSIONS = `
SELECT * FROM ${SESSIONS} ORDER BY ${SESSIONS}.created_at DESC;
`;

export const SESSION_BY_ID = `
SELECT name, error FROM ${SESSIONS} WHERE ${SESSIONS}.id = $1 AND ${SESSIONS}.active = true;
`;

export const CREATE_SESSION = `
INSERT INTO ${SESSIONS} (id, name, browser, error)
VALUES ($1, $2, $3, $4)
RETURNING id, name;
`;

export const UPDATE_SESSION_BY_ID = `
UPDATE ${SESSIONS}
SET name = COALESCE($2, name), browser = COALESCE($3, browser), error = $4, active = COALESCE($5, active), updated_at = NOW()
WHERE ${SESSIONS}.id = $1
RETURNING id, name;
`;

export const EXPIRE_SESSION_BY_ID = `
UPDATE ${SESSIONS} SET active = false, updated_at = NOW() WHERE ${SESSIONS}.id = $1 RETURNING id;
`;

export const DELETE_SESSION_BY_ID = `
DELETE FROM ${SESSIONS} WHERE ${SESSIONS}.id = $1 RETURNING id;
`;
