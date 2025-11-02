import { createContext, useContext } from "react";

// Create the context
export const AuthContext = createContext({});

// Create the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
