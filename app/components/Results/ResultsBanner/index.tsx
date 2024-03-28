import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { semanticTimestamp } from "@/utils/day";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import { FC, useCallback, useMemo } from "react";
import classNames from "clsx";

import styles from "./ResultsBanner.module.css";

export interface ResultsBanner {}

export const ResultsBanner: FC<ResultsBanner> = () => {
  const birthdateContext = useBirthDateContext();
  const pubSub = usePubSubContext();

  const [birthdateString, semanticBirthdate, sex] = useMemo(
    () => [
      birthdateContext!.birthdate!.format(),
      semanticTimestamp(birthdateContext!.birthdate!),
      birthdateContext!.sex!,
    ],
    [birthdateContext]
  );

  const handleClick = useCallback(() => {
    pubSub?.publish(DIALOG_ACTIONS.OPEN);
  }, [pubSub]);

  const className = classNames(styles.container, "container");

  return (
    <div data-full-bleed>
      <div className={className}>
        <section className={styles.content}>
          <h2>Das Spiel ist beendet!</h2>
          <span>
            Unser {sex === "female" ? "Mädchen" : "Bub"} wurde am{" "}
            <time dateTime={birthdateString}>
              <b>{semanticBirthdate}</b>
            </time>{" "}
            geboren.
          </span>
          <button type="button" onClick={handleClick}>
            Siegerliste anzeigen
          </button>
        </section>
      </div>
    </div>
  );
};
