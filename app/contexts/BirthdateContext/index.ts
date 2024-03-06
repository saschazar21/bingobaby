import { Dayjs } from "dayjs";
import { createContext, useContext } from "react";

export const BirthdateContext = createContext<Dayjs | null>(null);

export const useBirthDateContext = () => useContext(BirthdateContext);
