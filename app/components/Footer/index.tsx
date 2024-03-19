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

  const { birthdate, calculatedBirthdate } = value ?? {};

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

  const [
    isBirthdateInTheFuture,
    birthdateString,
    calculatedBirthdateString,
    semanticBirthdate,
    semanticCalculatedBirthdate,
  ] = useMemo(() => {
    if (!calculatedBirthdate) {
      return [null, null, null];
    }
    return [
      isAfterToday(calculatedBirthdate),
      birthdate ? birthdate.toISOString() : null,
      calculatedBirthdate.format("YYYY-MM-DD"),
      birthdate ? birthdate.format("DD. MMMM YYYY [um] HH:mm [Uhr]") : null,
      semanticDate(calculatedBirthdate),
    ];
  }, [birthdate, calculatedBirthdate]);

  const birthdateInfo = useMemo(() => {
    if (birthdateString) {
      return (
        <span>
          👶🏻 Unser Baby wurde am{" "}
          <time dateTime={birthdateString}>
            <b>{semanticBirthdate}</b>
          </time>{" "}
          geboren. 🎉😍 Danke für eure Teilnahme am Schätzspiel!
        </span>
      );
    }

    return isBirthdateInTheFuture ? (
      <span>
        ⏳ Noch ca. <b>{relativeTime}</b> bis zum errechneten Geburtstermin am{" "}
        <time dateTime={calculatedBirthdateString}>
          <b>{semanticCalculatedBirthdate}</b>
        </time>
        .
      </span>
    ) : (
      <span>
        ⌛ Es sind bereits <b>{relativeTime}</b> seit dem errechneten
        Geburtstermin am{" "}
        <time dateTime={calculatedBirthdateString as string}>
          <b>{semanticCalculatedBirthdate}</b>
        </time>{" "}
        vergangen.
      </span>
    );
  }, [
    birthdateString,
    isBirthdateInTheFuture,
    relativeTime,
    calculatedBirthdateString,
    semanticCalculatedBirthdate,
    semanticBirthdate,
  ]);

  if (!calculatedBirthdate) {
    return null;
  }

  return (
    <footer data-full-bleed>
      <div className="container">{birthdateInfo}</div>
    </footer>
  );
};
