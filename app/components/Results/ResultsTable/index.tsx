import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { calculateOffset, dateObject, semanticTimestamp } from "@/utils/day";
import { FC, useMemo } from "react";
import { PiTrophyBold } from "react-icons/pi";
import { Dayjs } from "dayjs";

import styles from "./ResultsTable.module.css";

export interface ResultsTableProps {}

export const ResultsTable: FC<ResultsTableProps> = () => {
  const birthdateData = useBirthDateContext();

  const data = useMemo(
    () =>
      birthdateData?.winners.map((entry) => ({
        ...entry,
        date: dateObject(entry.date),
        offset: calculateOffset(birthdateData.birthdate as Dayjs, entry.date),
      })),
    [birthdateData]
  );

  const rows = useMemo(() => {
    if (!data?.length) {
      return null;
    }

    return data.map(({ name, date, offset }, i) => (
      <div
        key={date.format()}
        className={styles.row}
        role="row"
        data-place={i + 1}
      >
        <div role="cell">
          {i === 0 ? <PiTrophyBold title="Sieger" /> : <span>{i + 1}.</span>}
        </div>
        <div role="cell">
          <strong>{name}</strong>
        </div>
        <div role="cell">
          <time dateTime={date.format()}>
            <span>{semanticTimestamp(date)}</span>
          </time>
        </div>
        <div role="cell">
          <span>
            <b data-subheader>
              Abweichung:
              <br />
            </b>
            {offset}
          </span>
        </div>
      </div>
    ));
  }, [data]);

  return (
    <div className={styles.table} role="table" aria-label="Resultate">
      <div className={styles.row} role="row">
        <div role="columnheader">Platz</div>
        <div role="columnheader">Name</div>
        <div role="columnheader">Schätzung</div>
        <div role="columnheader" aria-sort="descending" data-offset>
          Abweichung
        </div>
      </div>
      {rows}
    </div>
  );
};
