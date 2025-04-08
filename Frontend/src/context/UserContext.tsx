import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  email: string;
  fullName: {
    firstname: string;
    lastname: string;
  };
  token:string
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = atob(base64Payload);
        const parsedUser = JSON.parse(decodedPayload);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse JWT:", err);
        setUser(null);
      }
    }
  }, []);; 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
