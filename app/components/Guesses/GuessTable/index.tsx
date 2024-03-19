import { GuessForm } from "@/components/GuessForm";
import { Modal } from "@/components/Modal";
import { useBirthDateContext } from "@/contexts/BirthdateContext";
import { useGuessContext } from "@/contexts/GuessContext";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { PubSubContextProvider } from "@/contexts/PubSubContext";
import { FC, MouseEventHandler, useCallback, useMemo, useRef } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import { GuessTableEntry } from "../GuessTableEntry";

import styles from "./GuessTableEntry.module.css";

export interface GuessTableProps {}

export const GuessTable: FC<GuessTableProps> = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const birthdateContext = useBirthDateContext();
  const data = useGuessContext();
  const [guess] = useGuessEditContext() ?? [];

  const guesses = useMemo(() => {
    if (data?.state.guesses) {
      return data.state.guesses.map((guess) => (
        <GuessTableEntry className={styles.row} key={guess.id} guess={guess} />
      ));
    }
    return null;
  }, [data?.state.guesses]);

  const handleOpenDialog: MouseEventHandler = useCallback((_e) => {
    ref.current?.showModal();
  }, []);

  return (
    <>
      {guesses?.length ? (
        <div className={styles.table} role="table" aria-label="Schätzungen">
          <div className={styles.row} role="row">
            <div role="columnheader">Geschlecht</div>
            <div role="columnheader" aria-sort="ascending">
              Geburtszeitpunkt
            </div>
            <div role="columnheader">Zuletzt geändert</div>
            {birthdateContext?.isGameOver ? (
              <div role="columnheader" data-offset>
                Abweichung
              </div>
            ) : null}
          </div>
          {guesses}
        </div>
      ) : null}
      {!birthdateContext?.isGameOver &&
      !birthdateContext?.isLockDateReached &&
      (data?.maxGuesses ?? 0) > (data?.state.guesses.length ?? 0) ? (
        <button
          onClick={handleOpenDialog}
          type="button"
          disabled={birthdateContext?.isGameOver}
        >
          <span>Neue Schätzung</span> <PiPlusCircleBold role="presentation" />
        </button>
      ) : null}
      <PubSubContextProvider>
        <Modal
          ref={ref}
          heading={guess?.id ? "Schätzung bearbeiten" : "Neue Schätzung"}
        >
          <GuessForm />
        </Modal>
      </PubSubContextProvider>
    </>
  );
};
