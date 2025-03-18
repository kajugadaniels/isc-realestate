import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getCurrentUser } from "@/services/api";  // Import the function to fetch user info after login
import { getStoredTokens } from "@/services/api";  // Import the function to get stored tokens

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  // Function to fetch the current user and set the user state
  const fetchUser = async () => {
    const { accessToken, refreshToken } = await getStoredTokens();

    // If tokens are available, fetch the user data
    if (accessToken && refreshToken) {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);  // Set user data
          setIsLogged(true);  // Set logged-in state
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        setIsLogged(false);
      }
    } else {
      setIsLogged(false);  // If no tokens, user is logged out
    }

    setLoading(false);  // Set loading to false after the user is fetched
  };

  // Refetch function to refresh user data after login or logout
  const refetch = () => {
    fetchUser();
  };

  useEffect(() => {
    fetchUser();  // Fetch user data on mount
  }, []);

  return (
    <GlobalContext.Provider value={{ isLogged, user, loading, refetch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
