import { USERS } from "../types.d.ts";

export const ALL_USERS = `
SELECT * FROM ${USERS} ORDER BY name ASC;
`;

export const COUNT_USERS = `
SELECT COUNT(*) as ${USERS} FROM ${USERS};
`;

export const USER_BY_NAME = `
SELECT * FROM ${USERS} WHERE ${USERS}.name = $1;
`;

export const CREATE_USER = `
INSERT INTO ${USERS} (name)
VALUES ($1)
ON CONFLICT (name) DO NOTHING
RETURNING name;
`;
