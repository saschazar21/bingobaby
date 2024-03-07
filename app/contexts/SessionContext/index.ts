import { Session } from "@/deno/postgres/queries/sessions";
import { createContext, useContext } from "react";

export const SessionContext = createContext<
  Pick<Session, "error" | "name"> | null
>(null);

export const useSessionContext = () => useContext(SessionContext);
