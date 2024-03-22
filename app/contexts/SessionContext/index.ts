import { Session } from "@/deno/postgres/types";
import { createContext, useContext } from "react";

export const SessionContext = createContext<
  Pick<Session, "error" | "name"> | null
>(null);

export const useSessionContext = () => useContext(SessionContext);
