import React, { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    refetch: originalRefetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  // We convert undefined to null for consistency.
  const safeUser = user === undefined ? null : user;

  // `isLogged` will be false if there is no user.
  const isLogged = !!safeUser;

  // We adapted `refetch` to avoid possible parameter problems.
  const refetch = (newParams?: Record<string, string | number>) => {
    return originalRefetch(newParams || {}); 
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user: safeUser,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};


export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
