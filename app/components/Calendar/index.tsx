import { FC, useMemo } from "react";
import styles from "./Calendar.module.css";
import { useCalendar } from "./useCalendar";
import { dateObject } from "@/utils/day";

export interface CalendarProps {
  month: number;
  year: number;
}

export const Calendar: FC<CalendarProps> = (props) => {
  const { state } = useCalendar(props);

  const heading = useMemo(
    () => dateObject(`${state.year}-${state.month}-01`).format("MMMM YYYY"),
    [state]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <strong>{heading}</strong>
      </div>
    </div>
  );
};
