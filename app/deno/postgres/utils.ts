export { dateObject } from "../../utils/day.ts";
export { LOCK_DATE, MAX_DATE } from "../../utils/constants.ts";

export const selectUtcTimestamp = (column: string) =>
  `${column} AT TIME ZONE 'utc' AS ${column}`;
