import { Guess } from "@/deno/postgres/types";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useGuessContext } from "../GuessContext";

export interface GuessEditContextProps {
  children: ReactNode | ReactNode[];
  id?: string;
}

const GuessEditContext = createContext<
  [Guess | null, Dispatch<SetStateAction<Guess | null>>]
>([
  null,
  (value: ((prevState: Guess | null) => Guess | null) | Guess | null) => null,
]);

export const useGuessEditContext = () => useContext(GuessEditContext);

export const GuessEditContextProvider: FC<GuessEditContextProps> = (props) => {
  const guessContextValue = useGuessContext();

  const found = useMemo(
    () =>
      guessContextValue?.state.guesses.find(({ id }) => id === props.id) ??
      null,
    [props.id, guessContextValue?.state?.guesses]
  );

  const value = useState<Guess | null>(found);

  return (
    <GuessEditContext.Provider value={value}>
      {props.children}
    </GuessEditContext.Provider>
  );
};
