"use client";
import { createContext, useContext, useState } from "react";

type AuthCtx = {
  user: null;
  loading: boolean;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading] = useState(false);

  const logout = () => {
    window.location.href = "/login";
  };

  return (
    <Ctx.Provider value={{ user: null, loading, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
