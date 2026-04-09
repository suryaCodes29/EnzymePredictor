import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('enzymepredict_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('enzymepredict_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('enzymepredict_token', token);
    } else {
      localStorage.removeItem('enzymepredict_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('enzymepredict_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('enzymepredict_user');
    }
  }, [user]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/user/login', payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/user/register', payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const { data } = await api.get('/user/profile');
    setUser(data.user);
    return data.user;
  };

  const googleLogin = async (googleToken) => {
    setLoading(true);
    try {
      const { data } = await api.post('/user/google-login', { token: googleToken });
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      googleLogin,
      register,
      refreshProfile,
      setUser,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
