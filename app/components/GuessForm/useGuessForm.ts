import { useDialogContext } from "@/contexts/DialogContext";
import { useGuessEditContext } from "@/contexts/GuessEditContext";
import { usePubSubContext } from "@/contexts/PubSubContext";
import { useLazyApi } from "@/hooks/useApi";
import { DIALOG_ACTIONS } from "@/utils/pubsub";
import { validateAgainstPastDate } from "@/utils/validators";
import { FormApi, FormState } from "informed";
import { useCallback, useEffect, useMemo, useRef } from "react";

export interface GuessFormProps {
}

export const useGuessForm = () => {
  const dialogRef = useDialogContext();
  const ref = useRef<FormApi>(null);
  const pubSub = usePubSubContext();
  const [guess, setGuess] = useGuessEditContext() ?? [];

  const [method, action] = useMemo(
    () =>
      guess ? ["PUT", `/api/guesses/${guess.id}`] : ["POST", "/api/guesses"],
    [guess],
  );

  console.log(guess, method, action);

  const { error, isLoading, submit } = useLazyApi(
    action,
    method as "PUT" | "POST",
  );

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
  }, [dialogRef, guess]);

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
    const { errors, maskedValues, valid: isValid } = formState;
    if (isValid) {
      const data = await submit(maskedValues as Record<string, string>);
      console.log(data);
    }
  }, [submit]);

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
