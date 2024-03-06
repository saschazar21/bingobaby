import { GUESSES } from "../types.d.ts";

export const ALL_GUESSES = `
SELECT * FROM ${GUESSES} ORDER BY ${GUESSES}.date ASC;
`;

export const COUNT_GUESSES = `
SELECT COUNT(*) AS ${GUESSES} FROM ${GUESSES};
`;

export const VALID_GUESSES = `
SELECT * FROM ${GUESSES} WHERE ${GUESSES}.date >= CURRENT_DATE ORDER BY ${GUESSES}.date ASC;
`;

export const EXPIRED_GUESSES = `
SELECT * FROM ${GUESSES} WHERE ${GUESSES}.date < CURRENT_DATE ORDER BY ${GUESSES}.date DESC;
`;

export const GUESSES_BY_NAME = `
SELECT * FROM ${GUESSES} WHERE ${GUESSES}.name = $1 ORDER BY ${GUESSES}.date ASC;
`;

export const GUESS_BY_ID = `
SELECT * FROM ${GUESSES} WHERE ${GUESSES}.id = $1;
`;

export const CREATE_GUESS = `
INSERT INTO ${GUESSES} (id, name, date, sex) VALUES ($1, $2, $3, $4) RETURNING id;
`;

export const UPDATE_GUESS_BY_ID = `
UPDATE ${GUESSES} SET sex = $2, date = $3, updated_at = NOW() WHERE ${GUESSES}.id = $1 RETURNING id;
`;

export const DELETE_GUESS_BY_ID = `
DELETE FROM ${GUESSES} WHERE ${GUESSES}.id = $1 RETURNING id;
`;
