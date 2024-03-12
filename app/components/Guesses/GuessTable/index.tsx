import { Modal } from "@/components/Modal";
import { useGuessContext } from "@/contexts/GuessContext";
import { FC, useEffect, useMemo, useState } from "react";
import { PiPlusCircleBold } from "react-icons/pi";
import { GuessTableEntry } from "../GuessTableEntry";

import styles from "./GuessTableEntry.module.css";
import { GuessForm } from "@/components/GuessForm";

export interface GuessTableProps {}

export const GuessTable: FC<GuessTableProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const data = useGuessContext();

  const guesses = useMemo(() => {
    if (data?.state.guesses) {
      return data.state.guesses.map((guess) => (
        <GuessTableEntry className={styles.row} key={guess.id} guess={guess} />
      ));
    }
    return null;
  }, [data?.state.guesses]);

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
          </div>
          {guesses}
        </div>
      ) : null}
      {(data?.maxGuesses ?? 0) > (data?.state.guesses.length ?? 0) ? (
        <button onClick={() => setIsOpen(true)} type="button">
          <span>Neue Schätzung</span> <PiPlusCircleBold role="presentation" />
        </button>
      ) : null}
      {isOpen ? (
        <Modal heading="Neue Schätzung" onClose={() => setIsOpen(false)}>
          <GuessForm />
        </Modal>
      ) : null}
    </>
  );
};
