import { Dayjs } from "dayjs";
import { createContext, useContext } from "react";

export interface BirthdateContextValue {
  birthdate?: Dayjs | null;
  calculatedBirthdate: Dayjs;
  isGameOver: boolean;
  isLockDateReached: boolean;
  lockDate: Dayjs;
}

export const BirthdateContext = createContext<BirthdateContextValue | null>(
  null,
);

export const useBirthDateContext = () => useContext(BirthdateContext);
