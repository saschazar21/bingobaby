import { FC, ReactNode, createContext, useContext, useMemo } from "react";
import { GuessEditContextValue, useGuessEdit } from "./useGuessEdit";
import { useGuessContext } from "../GuessContext";

export interface GuessEditContextProps {
  children: ReactNode | ReactNode[];
  id?: string;
}

const GuessEditContext = createContext<GuessEditContextValue | null>(null);

export const useGuessEditContext = () => useContext(GuessEditContext);

export const GuessEditContextProvider: FC<GuessEditContextProps> = (props) => {
  const guessContextValue = useGuessContext();

  const guess = useMemo(
    () =>
      guessContextValue?.state.guesses.find(({ id }) => id === props.id) ??
      null,
    [props.id, guessContextValue?.state?.guesses]
  );

  const value = useGuessEdit(guess ? { guess } : undefined);

  return (
    <GuessEditContext.Provider value={value}>
      {props.children}
    </GuessEditContext.Provider>
  );
};
