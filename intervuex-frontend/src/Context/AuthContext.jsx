/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage so context survives page reloads
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      // ignore storage errors
    }
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
