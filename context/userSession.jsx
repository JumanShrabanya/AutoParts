"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const UserSessionContext = createContext({
  loading: true,
  authenticated: false,
  user: null,
  refresh: async () => {},
  logout: async () => {},
});

export function UserSessionProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const loadSession = async () => {
    try {
      const { data } = await axios.get("/api/auth/session");
      setAuthenticated(!!data?.authenticated);
      setUser(data?.user || null);
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const logout = async () => {
    try {
      await axios.delete("/api/auth/session");
      setAuthenticated(false);
      setUser(null);
    } catch (e) {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ loading, authenticated, user, refresh: loadSession, logout }),
    [loading, authenticated, user]
  );

  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useUserSession() {
  return useContext(UserSessionContext);
}
