import { BROWSERS } from "../types.d.ts";

export const ALL_BROWSERS = `
SELECT * FROM ${BROWSERS} ORDER BY ${BROWSERS}.created_at DESC;
`;

export const CREATE_BROWSER = `
INSERT INTO ${BROWSERS} (user_agent, name, version, device, os)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_agent) DO NOTHING
RETURNING user_agent;
`;
