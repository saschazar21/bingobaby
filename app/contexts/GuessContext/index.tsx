import { createContext, FC, ReactNode, useContext } from "react";
import { GuessContextValue, useGuesses } from "./useGuesses";
import { Guess } from "@/deno/postgres/types";

export interface GuessContextProps {
  children: ReactNode | ReactNode[];
  guesses?: Guess[];
  maxGuesses: number;
}

const GuessContext = createContext<GuessContextValue | null>(null);

export const useGuessContext = () => useContext(GuessContext);

export const GuessContextProvider: FC<GuessContextProps> = (props) => {
  const value = useGuesses(props.guesses);

  return (
    <GuessContext.Provider value={{ ...value, maxGuesses: props.maxGuesses }}>
      {props.children}
    </GuessContext.Provider>
  );
};
