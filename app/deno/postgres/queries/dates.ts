import { DATES } from "../types.d.ts";
import { selectUtcTimestamp } from "../utils.ts";

export const ALL_DATES = `
SELECT
  id, 
  ${selectUtcTimestamp("date")}
FROM ${DATES};
`;

export const DATE_BY_ID = `
SELECT
  id, 
  ${selectUtcTimestamp("date")}
FROM ${DATES}
WHERE ${DATES}.id = $1;
`;

export const CREATE_DATE = `
INSERT INTO ${DATES} (id, date)
VALUES ($1, $2)
RETURNING
  id,
  ${selectUtcTimestamp("date")};
`;

export const UPDATE_DATE_BY_ID = `
UPDATE ${DATES}
SET date = $2
WHERE ${DATES}.id = $1
RETURNING
  id,
  ${selectUtcTimestamp("date")};
`;

export const DELETE_DATE_BY_ID = `
DELETE FROM ${DATES}
WHERE ${DATES}.id = $1
RETURNING
  id,
  ${selectUtcTimestamp("date")};
`;
