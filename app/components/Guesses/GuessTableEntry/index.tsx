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
import {
  ONE_MINUTE,
  calculateOffset,
  dateObject,
  relativeTimeTo,
  semanticTimestamp,
} from "@/utils/day";
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
    setLastUpdatedAt(relativeTimeTo(dateObject(guess.updated_at), false));

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
        {semanticTimestamp(dateObject(guess.date))}
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
      birthdateContext?.isGameOver ??
      birthdateContext?.isLockDateReached ??
      dateObject(guess.date) < dateObject(new Date().toISOString()),
    [
      birthdateContext?.isGameOver,
      birthdateContext?.isLockDateReached,
      guess.date,
    ]
  );

  const offset = useMemo(() => {
    if (!birthdateContext?.birthdate) {
      return null;
    }

    return calculateOffset(birthdateContext.birthdate, guess.date);
  }, [birthdateContext?.birthdate, guess.date]);

  const className = classNames(customClassName, {
    [styles.disabled]: isDisabled && !birthdateContext?.isGameOver,
  });

  return (
    <div className={className} role="row" data-sex={guess.sex}>
      <div className={styles.icon} role="cell">
        {icon}
      </div>
      <div role="cell">
        <time dateTime={guess.date}>{formattedDate}</time>
      </div>
      <div role="cell">
        <time dateTime={guess.updated_at} data-no-print>
          {lastUpdatedAt}
        </time>
        <time dateTime={guess.updated_at} data-print-only>
          {semanticTimestamp(dateObject(guess.updated_at))}
        </time>
      </div>
      {!birthdateContext?.isGameOver ? (
        <div className={styles.button} role="cell" data-no-print>
          <button disabled={isDisabled} type="button" onClick={handleSetGuess}>
            <span>Bearbeiten</span>
            <PiPenBold role="presentation" />
          </button>
        </div>
      ) : (
        <div role="cell" data-offset>
          {offset}
        </div>
      )}
    </div>
  );
};
