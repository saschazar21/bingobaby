import { FC, ReactNode, createContext, useContext } from "react";
import { LoginFormHook, useLoginForm } from "./useLoginForm";

export interface LoginContextProviderProps {
  children: ReactNode | ReactNode[];
}

const LoginContext = createContext<LoginFormHook | null>(null);

export const useLoginContext = () => useContext(LoginContext);

export const LoginContextProvider: FC<LoginContextProviderProps> = ({
  children,
}) => {
  const value = useLoginForm();

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};
