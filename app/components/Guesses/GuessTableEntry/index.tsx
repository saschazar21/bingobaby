import { Guess } from "@/deno/postgres/types";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "clsx";
import {
  PiGenderFemaleBold,
  PiGenderMaleBold,
  PiPenBold,
} from "react-icons/pi";
import { ONE_MINUTE, dateObject, relativeTimeTo } from "@/utils/day";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { BirthdateContext } from "@/contexts/BirthdateContext";

import styles from "./GuessTableEntry.module.css";

export interface GuessTableEntryProps {
  className?: string;
  guess: Guess;
}

export const GuessTableEntry: FC<GuessTableEntryProps> = ({
  className: customClassName,
  guess,
}) => {
  const birthdateContext = useContext(BirthdateContext);
  const [, setGuess] = useGuessEditContext() ?? [];
  const [lastUpdatedAt, setLastUpdatedAt] = useState(
    relativeTimeTo(dateObject(guess.updated_at), false)
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setLastUpdatedAt(relativeTimeTo(dateObject(guess.updated_at), false)),
      ONE_MINUTE
    );

    return () => {
      clearInterval(interval);
    };
  }, [guess.updated_at]);

  const icon = useMemo(
    () =>
      guess.sex === "male" ? (
        <PiGenderMaleBold title="ein Bub" />
      ) : (
        <PiGenderFemaleBold title="ein Mädchen" />
      ),
    [guess.sex]
  );

  const formattedDate = useMemo(
    () => (
      <time dateTime={dateObject(guess.date).format()}>
        {dateObject(guess.date).format("D. MMMM YYYY, HH:mm")}
      </time>
    ),
    [guess.date]
  );

  const handleSetGuess = useCallback(
    () => (typeof setGuess === "function" ? setGuess(guess) : null),
    [setGuess, guess]
  );

  const isDisabled = useMemo(
    () =>
      birthdateContext?.isLockDateReached ||
      dateObject(guess.date) < dateObject(new Date().toISOString()),
    [birthdateContext?.isLockDateReached, dateObject, guess.date]
  );

  const className = classNames(customClassName, {
    [styles.disabled]: isDisabled,
  });

  return (
    <div className={className} role="row" data-sex={guess.sex}>
      <div className={styles.icon} role="cell">
        {icon}
      </div>
      <div role="cell">{formattedDate}</div>
      <div role="cell">{lastUpdatedAt}</div>
      <div className={styles.button} role="cell">
        <button disabled={isDisabled} type="button" onClick={handleSetGuess}>
          <span>Bearbeiten</span>
          <PiPenBold role="presentation" />
        </button>
      </div>
    </div>
  );
};
