import { DATES } from "../types.d.ts";
import { selectUtcTimestamp } from "../utils.ts";

export const ALL_DATES = `
SELECT
  id, 
  ${selectUtcTimestamp("date")},
  sex
FROM ${DATES};
`;

export const DATE_BY_ID = `
SELECT
  id, 
  ${selectUtcTimestamp("date")},
  sex
FROM ${DATES}
WHERE ${DATES}.id = $1;
`;

export const CREATE_DATE = `
INSERT INTO ${DATES} (id, date, sex)
VALUES ($1, $2, $3)
RETURNING
  id,
  ${selectUtcTimestamp("date")},
  sex;
`;

export const UPDATE_DATE_BY_ID = `
UPDATE ${DATES}
SET date = COALESCE($2, date), sex = COALESCE($3, sex), updated_at = NOW()
WHERE ${DATES}.id = $1
RETURNING
  id,
  ${selectUtcTimestamp("date")},
  sex;
`;

export const DELETE_DATE_BY_ID = `
DELETE FROM ${DATES}
WHERE ${DATES}.id = $1
RETURNING
  id,
  ${selectUtcTimestamp("date")},
  sex;
`;
