import { dateObject } from "./day";

export const CALCULATED_BIRTHDATE = process.env.CALCULATED_BIRTHDATE;
export const MAX_DATE = dateObject(CALCULATED_BIRTHDATE).utc().add(4, "weeks"); // change value also in ../deno/postgres/utils.ts
