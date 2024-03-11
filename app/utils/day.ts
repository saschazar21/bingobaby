import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/de-at";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("de-at");

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

export const isAfterToday = (date: Dayjs) => {
  return dayjs().isBefore(date, "day");
};

export const relativeTimeTo = (date: Dayjs, withoutSuffix = true) => {
  return dayjs().to(date, withoutSuffix);
};

export const semanticDate = (date: Dayjs) => {
  return date.format("D. MMMM YYYY");
};

export const dateObject = (dateString: string) => {
  return dayjs(dateString);
};

export const lockDate = (dateString: string) => {
  return dayjs(dateString).utc().subtract(3, "weeks");
};
