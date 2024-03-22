import { GuessData } from "@/deno/postgres/types";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface BirthdateEditContextProviderProps {
  auth: string;
  birthdate: GuessData | null;
  children: ReactNode | ReactNode[];
}

export type BirthdateContextValue = [
  GuessData | null,
  Dispatch<SetStateAction<GuessData | null>>,
  string
];

const BirthdateEditContext = createContext<BirthdateContextValue | null>(null);

export const useBirthdateEditContext = () => useContext(BirthdateEditContext);

export const BirthdateEditContextProvider: FC<
  BirthdateEditContextProviderProps
> = ({ auth, birthdate, children }) => {
  const value = useState<GuessData | null>(birthdate);

  return (
    <BirthdateEditContext.Provider value={[...value, auth]}>
      {children}
    </BirthdateEditContext.Provider>
  );
};
