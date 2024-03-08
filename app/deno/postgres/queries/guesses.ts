import { MAX_DATE } from "../utils.ts";
import { GUESSES } from "../types.d.ts";

export const ALL_GUESSES = `
SELECT * FROM ${GUESSES} ORDER BY ${GUESSES}.date ASC;
`;

export const COUNT_GUESSES = `
SELECT COUNT(*) AS ${GUESSES} FROM ${GUESSES};
`;

export const VALID_GUESSES = `
SELECT date, sex FROM ${GUESSES} WHERE ${GUESSES}.date >= CURRENT_DATE AND ${GUESSES}.date < '${MAX_DATE}' ORDER BY ${GUESSES}.date ASC;
`;

export const EXPIRED_GUESSES = `
SELECT date, sex FROM ${GUESSES} WHERE ${GUESSES}.date < CURRENT_DATE ORDER BY ${GUESSES}.date DESC;
`;

export const GUESSES_BY_NAME = `
SELECT * FROM ${GUESSES} WHERE ${GUESSES}.name = $1 ORDER BY ${GUESSES}.date ASC;
`;

export const GUESS_BY_ID = `
SELECT date, sex FROM ${GUESSES} WHERE ${GUESSES}.id = $1;
`;

export const CREATE_GUESS = `
INSERT INTO ${GUESSES} (id, name, date, sex) VALUES ($1, $2, $3, $4) RETURNING id, date, sex;
`;

export const UPDATE_GUESS_BY_ID = `
UPDATE ${GUESSES} SET date = COALESCE($2, date), sex = COALESCE($3, sex), updated_at = NOW() WHERE ${GUESSES}.id = $1 RETURNING id, date, sex;
`;

export const DELETE_GUESS_BY_ID = `
DELETE FROM ${GUESSES} WHERE ${GUESSES}.id = $1 RETURNING id;
`;
