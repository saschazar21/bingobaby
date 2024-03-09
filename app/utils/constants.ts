import { dateObject } from "./day";

export const CALCULATED_BIRTHDATE = process.env.CALCULATED_BIRTHDATE;
export const MAX_DATE = dateObject(CALCULATED_BIRTHDATE).utc().add(4, "weeks"); // change value also in ../deno/postgres/utils.ts
export const LOCK_DATE = dateObject(CALCULATED_BIRTHDATE).utc().subtract(
  3,
  "weeks",
); // change value also in ../deno/postgres/utils.ts
