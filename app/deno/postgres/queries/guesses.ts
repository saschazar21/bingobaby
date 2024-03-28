import { MAX_DATE, selectUtcTimestamp } from "../utils.ts";
import { GUESSES } from "../types.d.ts";

const SELECT_COLUMNS = [
  ["id", "id"],
  ["name", "name"],
  ["sex", "sex"],
  ["date", selectUtcTimestamp("date")],
  ["created_at", selectUtcTimestamp("created_at")],
  ["updated_at", selectUtcTimestamp("updated_at")],
];

const excludeColumns = (filter: string[]) =>
  SELECT_COLUMNS.filter(([key]) => !filter.includes(key)).map(([key]) => key);

const filterSelectColumns = (filter: string[] = []) =>
  SELECT_COLUMNS.filter(([key]) => filter.includes(key)).map(([, value]) =>
    value
  );

export const ALL_GUESSES = `
SELECT
  ${filterSelectColumns(excludeColumns(["id", "name"])).join(", ")}
FROM ${GUESSES}
ORDER BY ${GUESSES}.date ASC;
`;

export const COUNT_GUESSES = `
SELECT
  COUNT(*) AS ${GUESSES}
FROM ${GUESSES};
`;

export const CLOSEST_GUESSES_BY_SEX = `
SELECT
  ${filterSelectColumns(["name", "date"])}
FROM ${GUESSES}
WHERE ${GUESSES}.sex = $2
ORDER BY ABS(EXTRACT(EPOCH FROM ${GUESSES}.date - $1))
LIMIT 3;
`;

export const VALID_GUESSES = `
SELECT 
  ${filterSelectColumns(["date", "sex"]).join(", ")} 
FROM ${GUESSES}
WHERE ${GUESSES}.date >= CURRENT_DATE AND ${GUESSES}.date < '${MAX_DATE}'
ORDER BY ${GUESSES}.date ASC;
`;

export const EXPIRED_GUESSES = `
SELECT
  ${filterSelectColumns(["date", "sex"]).join(", ")}
FROM ${GUESSES}
WHERE ${GUESSES}.date < CURRENT_DATE
ORDER BY ${GUESSES}.date DESC;
`;

export const GUESSES_BY_NAME = `
SELECT
  ${filterSelectColumns(excludeColumns(["name", "created_at"])).join(", ")}
FROM ${GUESSES}
WHERE ${GUESSES}.name = $1
ORDER BY ${GUESSES}.date ASC;
`;

export const GUESS_BY_ID = `
SELECT
  ${filterSelectColumns(["date", "sex"]).join(", ")}
FROM ${GUESSES}
WHERE ${GUESSES}.id = $1;
`;

export const CREATE_GUESS = `
INSERT INTO ${GUESSES} (id, name, date, sex)
VALUES ($1, $2, $3, $4)
RETURNING ${filterSelectColumns(excludeColumns(["name", "created_at"]))};
`;

export const UPDATE_GUESS_BY_ID = `
UPDATE ${GUESSES}
SET date = COALESCE($2, date), sex = COALESCE($3, sex), updated_at = NOW()
WHERE ${GUESSES}.id = $1
RETURNING ${filterSelectColumns(excludeColumns(["name", "created_at"]))};
`;

export const DELETE_GUESS_BY_ID = `
DELETE FROM ${GUESSES}
WHERE ${GUESSES}.id = $1
RETURNING ${filterSelectColumns(["id"]).join(", ")};
`;
