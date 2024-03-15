import { useDialogContext } from "@/contexts/DialogContext";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { Guess } from "@/deno/postgres/types";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import { FormApi, FormState } from "informed";
import { useCallback, useEffect, useMemo, useRef } from "react";

export interface GuessFormProps {
  guess?: Guess;
}

export const useGuessForm = (props: GuessFormProps) => {
  const dialogRef = useDialogContext();
  const ref = useRef<FormApi>(null);
  const pubSub = usePubSubContext();
  const [guess, setGuess] = useGuessEditContext() ?? [];

  useEffect(() => {
    if (guess) {
      ref.current?.setValues({
        id: guess.id,
        date: guess.date,
        sex: guess.sex,
      });

      dialogRef?.current?.showModal();
    } else {
      ref.current?.reset();
    }
  }, [guess]);

  const handleModalClose = useCallback((value?: string) => {
    if (value === DIALOG_ACTIONS.CLOSE) {
      typeof setGuess === "function" && setGuess(null);
    }
  }, [setGuess]);

  useEffect(() => {
    let unsubscribe: () => void;
    if (pubSub?.subscribe) {
      unsubscribe = pubSub.subscribe(handleModalClose);
    }

    return () => {
      if (typeof unsubscribe !== "undefined") {
        unsubscribe();
      }
    };
  }, [pubSub?.subscribe]);

  const [method, action] = useMemo(
    () =>
      props.guess
        ? ["PUT", `/api/guesses/${props.guess.id}`]
        : ["POST", "/api/guesses"],
    [props.guess],
  );

  const handleSubmit = useCallback((formState: FormState) => {
    console.log(formState);
  }, []);

  const handleSubmitFailure = useCallback((errors: Record<string, unknown>) => {
    console.log(errors);
  }, []);

  return { action, guess, handleSubmit, handleSubmitFailure, method, ref };
};
