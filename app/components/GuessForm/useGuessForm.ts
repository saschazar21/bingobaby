import { useDialogContext } from "@/contexts/DialogContext";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { Guess } from "@/deno/postgres/types";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import { validateAgainstPastDate, validateLength } from "@/utils/validators";
import { FormApi, FormState } from "informed";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    const { errors, maskedValues, valid: isValid } = formState;
    console.log(errors);
    if (isValid) {
      // TODO: add form submission;
    }
  }, []);

  const handleSubmitFailure = useCallback((formState: FormState) => {
    // TODO: add error handling;
  }, []);

  const validateDate = useCallback(
    (value: unknown) => {
      try {
        validateAgainstPastDate(value as string);
      } catch (e) {
        return (e as Error).message;
      }
    },
    [],
  );

  return {
    action,
    guess,
    handleSubmit,
    handleSubmitFailure,
    method,
    ref,
    validateDate,
  };
};
