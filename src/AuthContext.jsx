import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from './apiClient';
import { clearAuthTokens, getRefreshToken, setAuthTokens } from './utils/authTokens';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get('/auth/me');
        const payload = data?.data || data;
        setUser(payload?.user);
        setBusiness(payload?.business);
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
    const { data } = await api.post('/auth/login', { email, password });
    const payload = data?.data || data;
    if (payload?.tokens?.accessToken) {
      setAuthTokens(payload.tokens);
    }
    setUser(payload?.user);
    setBusiness(payload?.business);
    return payload;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    const result = data?.data || data;
    if (result?.tokens?.accessToken) {
      setAuthTokens(result.tokens);
    }
    setUser(result?.user);
    setBusiness(result?.business);
    return result;
  };

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', refreshToken ? { refreshToken } : undefined);
    } catch {
      // ignore
    }
    clearAuthTokens();
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
