import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/de-at";

dayjs.extend(relativeTime);
dayjs.locale("de-at");

export const ONE_HOUR = 3600000;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

export const isAfterToday = (date: Dayjs) => {
  return dayjs().isBefore(date, "day");
};

export const relativeTimeTo = (date: Dayjs) => {
  return dayjs().to(date, true);
};

export const semanticDate = (date: Dayjs) => {
  return date.format("D. MMMM YYYY");
};

export const dateObject = (dateString: string) => {
  return dayjs(dateString);
};
