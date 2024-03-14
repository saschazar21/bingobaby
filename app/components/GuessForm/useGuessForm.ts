import { Guess } from "@/deno/postgres/types";
import { FormState } from "informed";
import { useCallback, useMemo } from "react";

export interface GuessFormProps {
  guess?: Guess;
}

export const useGuessForm = (props: GuessFormProps) => {
  const [method, action] = useMemo(
    () =>
      props.guess
        ? ["PUT", `/api/guesses/${props.guess.id}`]
        : ["POST", "/api/guesses"],
    [props.guess],
  );

  const handleSubmit = useCallback((formState: FormState) => {}, []);

  const handleSubmitFailure = useCallback((errors: Record<string, unknown>) => {
    console.log(errors);
  }, []);

  return { action, handleSubmit, handleSubmitFailure, method };
};
