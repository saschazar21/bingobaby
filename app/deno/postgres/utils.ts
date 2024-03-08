import dayjs from "https://deno.land/x/deno_dayjs@v0.5.0/mod.ts";
import utc from "https://deno.land/x/deno_dayjs@v0.5.0/plugin/utc.ts";

dayjs.extend(utc);

// change value also in ../../utils/constants.ts
export const MAX_DATE = dayjs(Deno.env.get("CALCULATED_BIRTHDATE")).utc().add(
  4,
  "weeks",
).format();
