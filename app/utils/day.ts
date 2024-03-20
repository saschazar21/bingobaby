import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/de-at";

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale("de-at");

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

export const DEFAULT_TIMEZONE = "Europe/Vienna";

export const isAfterToday = (date: Dayjs) => {
  return dayjs().tz(DEFAULT_TIMEZONE).isBefore(date, "day");
};

export const relativeTimeTo = (date: Dayjs, withoutSuffix = true) => {
  return dayjs().tz(DEFAULT_TIMEZONE).to(date, withoutSuffix);
};

export const semanticDate = (date: Dayjs) => {
  return date.format("D. MMMM YYYY");
};

export const dateObject = (dateString: string) => {
  return dayjs(dateString).tz(DEFAULT_TIMEZONE);
};

export const lockDate = (dateString: string) => {
  return dayjs(dateString).utc().subtract(3, "weeks");
};
