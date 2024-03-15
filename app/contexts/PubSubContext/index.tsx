import { FC, ReactNode, createContext, useContext } from "react";
import { PubSub, usePubSub } from "./usePubSub";

export interface PubSubContextProviderProps {
  children: ReactNode | ReactNode[];
}

const PubSubContext = createContext<PubSub | null>(null);

export const usePubSubContext = () => useContext(PubSubContext);

export const PubSubContextProvider: FC<PubSubContextProviderProps> = ({
  children,
}) => {
  const value = usePubSub();

  return (
    <PubSubContext.Provider value={value}>{children}</PubSubContext.Provider>
  );
};
