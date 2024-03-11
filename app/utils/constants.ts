import { dateObject, lockDate } from "./day";

export const MAX_GUESSES = !isNaN(parseInt(process.env.MAX_GUESSES ?? "", 10))
  ? parseInt(process.env.MAX_GUESSES as string, 10)
  : 3;

export const CALCULATED_BIRTHDATE = process.env.CALCULATED_BIRTHDATE;
export const MAX_DATE = dateObject(CALCULATED_BIRTHDATE).utc().add(4, "weeks");
export const LOCK_DATE = lockDate(CALCULATED_BIRTHDATE);
