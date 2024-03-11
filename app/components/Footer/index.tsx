import { useBirthDateContext } from "@/contexts/BirthdateContext";
import {
  ONE_HOUR,
  isAfterToday,
  relativeTimeTo,
  semanticDate,
} from "@/utils/day";
import { FC, useEffect, useMemo, useState } from "react";

export const Footer: FC = () => {
  const value = useBirthDateContext();
  const [relativeTime, setRelativeTime] = useState<string>();

  const { calculatedBirthdate } = value ?? {};

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (calculatedBirthdate) {
      setRelativeTime(relativeTimeTo(calculatedBirthdate));
      interval = setInterval(
        () => setRelativeTime(relativeTimeTo(calculatedBirthdate)),
        ONE_HOUR
      );
    }

    return () => {
      clearInterval(interval);
    };
  }, [calculatedBirthdate]);

  const [isBirthdateInTheFuture, isoString, semanticBirthdate] = useMemo(() => {
    if (!calculatedBirthdate) {
      return [null, null, null];
    }
    return [
      isAfterToday(calculatedBirthdate),
      calculatedBirthdate.format("YYYY-MM-DD"),
      semanticDate(calculatedBirthdate),
    ];
  }, [calculatedBirthdate]);

  if (!calculatedBirthdate) {
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
