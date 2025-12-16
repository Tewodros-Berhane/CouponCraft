import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        setBusiness(data.business);
      } catch {
        setUser(null);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    setBusiness(data.business);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    setBusiness(data.business);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
    setBusiness(null);
  };

  const value = useMemo(
    () => ({
      user,
      business,
      loading,
      login,
      register,
      logout,
      setUser,
      setBusiness,
    }),
    [user, business, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
