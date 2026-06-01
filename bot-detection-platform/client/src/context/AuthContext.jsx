import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  saveAuth,
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const syncFromStorage = useCallback(() => {
    setToken(getStoredToken());
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    syncFromStorage();
    setLoading(false);

    const onExpired = () => {
      clearAuth();
      syncFromStorage();
    };

    window.addEventListener('botguard:auth-expired', onExpired);
    return () => window.removeEventListener('botguard:auth-expired', onExpired);
  }, [syncFromStorage]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerRequest(name, email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
      syncFromStorage,
    }),
    [token, user, loading, login, register, logout, syncFromStorage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
