import api from "@/lib/api";
import axios from "axios";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type User = {
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean; 
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`${process.env.NEXT_PUBLIC_Backend_Url}/user/profile`,
        )
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Failed to load user profile:", err);
        toast(err.response?.data?.message || "Failed to load profile");
        setUser(null);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
