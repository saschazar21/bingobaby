import { createContext, RefObject, useContext } from "react";

export const DialogContext = createContext<RefObject<HTMLDialogElement> | null>(
  null,
);

export const useDialogContext = () => useContext(DialogContext);
