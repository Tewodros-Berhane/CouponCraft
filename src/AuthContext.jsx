import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        setBusiness(data.business);
      } catch (err) {
        // Token might be invalid; clear it.
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        setToken(null);
        setRefreshToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const persistTokens = (access, refresh) => {
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("authToken", access);
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistTokens(data.tokens.accessToken, data.tokens.refreshToken);
    setUser(data.user);
    setBusiness(data.business);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistTokens(data.tokens.accessToken, data.tokens.refreshToken);
    setUser(data.user);
    setBusiness(data.business);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setBusiness(null);
    setToken(null);
    setRefreshToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      business,
      token,
      refreshToken,
      loading,
      login,
      register,
      logout,
      setUser,
      setBusiness,
    }),
    [user, business, token, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
