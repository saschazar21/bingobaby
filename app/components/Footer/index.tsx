import { useBirthDateContext } from "@/contexts/BirthdateContext";
import {
  ONE_HOUR,
  isAfterToday,
  relativeTimeTo,
  semanticDate,
} from "@/utils/day";
import { FC, useEffect, useMemo, useState } from "react";

export const Footer: FC = () => {
  const date = useBirthDateContext();
  const [relativeTime, setRelativeTime] = useState<string>();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (date) {
      setRelativeTime(relativeTimeTo(date));
      interval = setInterval(
        () => setRelativeTime(relativeTimeTo(date)),
        ONE_HOUR
      );
    }

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  const [isBirthdateInTheFuture, isoString, semanticBirthdate] = useMemo(() => {
    if (!date) {
      return [null, null, null];
    }
    return [isAfterToday(date), date.format("YYYY-MM-DD"), semanticDate(date)];
  }, [date]);

  if (!date) {
    return null;
  }

  return (
    <footer data-full-bleed>
      <div className="container">
        {isBirthdateInTheFuture ? (
          <span>
            ⏳ Noch ca. <b>{relativeTime}</b> bis zum errechneten Geburtstermin
            am{" "}
            <time dateTime={isoString}>
              <b>{semanticBirthdate}</b>
            </time>
            .
          </span>
        ) : (
          <span>
            ⌛ Es sind bereits <b>{relativeTime}</b> seit dem errechneten
            Geburtstermin am{" "}
            <time dateTime={isoString as string}>
              <b>{semanticBirthdate}</b>
            </time>{" "}
            vergangen.
          </span>
        )}
      </div>
    </footer>
  );
};
