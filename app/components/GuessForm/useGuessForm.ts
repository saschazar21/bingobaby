import { useDialogContext } from "@/contexts/DialogContext";
import { useGuessContext } from "@/contexts/GuessContext";
import { GUESS_ACTIONS } from "@/contexts/GuessContext/useGuesses";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { useLazyApi } from "@/hooks/useApi";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import { validateAgainstPastDate } from "@/utils/validators";
import { FormApi, FormState } from "informed";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface GuessFormProps {
}

export const useGuessForm = () => {
  const dialogRef = useDialogContext();
  const ref = useRef<FormApi>(null);
  const pubSub = usePubSubContext();
  const guesses = useGuessContext();
  const [guess, setGuess] = useGuessEditContext() ?? [];
  const [formError, setFormError] = useState<string | null>(null);

  const [method, action] = useMemo(
    () =>
      guess ? ["PUT", `/api/guesses/${guess.id}`] : ["POST", "/api/guesses"],
    [guess],
  );

  const { error: _, isLoading: __, submit } = useLazyApi(
    action,
    method as "PUT" | "POST",
  );

  const resetForm = useCallback(() => {
    if (dialogRef?.current?.open) {
      pubSub?.publish(DIALOG_ACTIONS.CLOSE);
    }
    setFormError(null);
    ref.current?.reset();
  }, [dialogRef, pubSub]);

  useEffect(() => {
    if (guess) {
      ref.current?.setValues({
        id: guess.id,
        date: guess.date,
        sex: guess.sex,
      });

      dialogRef?.current?.showModal();
    } else {
      resetForm();
    }
  }, [dialogRef, guess, pubSub, resetForm]);

  const handleErrorClose = useCallback(() => {
    setFormError(null);
  }, []);

  const handleModalClose = useCallback((value?: string) => {
    if (value === DIALOG_ACTIONS.CLOSE) {
      typeof setGuess === "function" && setGuess(null);
      ref.current?.reset();
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
  }, [handleModalClose, pubSub, pubSub?.subscribe]);

  const handleSubmit = useCallback(async (formState: FormState) => {
    const { errors: _, maskedValues, valid: isValid } = formState;
    if (guess) {
      if (guess.sex === maskedValues.sex && guess.date === maskedValues.date) {
        setGuess(null);
        return resetForm();
      }
    }

    if (isValid) {
      const res = await submit(maskedValues as Record<string, string>);
      if (res.error) {
        setFormError(res.error);
      } else {
        guesses?.dispatch({
          payload: res.data,
          type: guess ? GUESS_ACTIONS.UPDATE_GUESS : GUESS_ACTIONS.ADD_GUESS,
        });
        setGuess(null);
        resetForm();
      }
    }
  }, [guess, guesses, resetForm, setGuess, submit]);

  const handleSubmitFailure = useCallback((_formState: FormState) => {
    setFormError(
      "Es sind Fehler aufgetreten. Schätzung konnte nicht abgeschickt werden.",
    );
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
    formError,
    guess,
    handleErrorClose,
    handleSubmit,
    handleSubmitFailure,
    method,
    ref,
    validateDate,
  };
};
