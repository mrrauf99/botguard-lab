import api, { TOKEN_KEY, USER_KEY } from './api';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  saveAuth(data.token, data.user);
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  saveAuth(data.token, data.user);
  return data;
};

export const logout = () => {
  clearAuth();
};
