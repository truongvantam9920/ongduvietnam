import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api, tokenStorage } from '../services/api.js';
import type { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenStorage.get());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const currentToken = tokenStorage.get();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.getMe();
      if (response.success && response.user) {
        setUser(response.user);
        setToken(currentToken);
      } else {
        tokenStorage.remove();
        setUser(null);
        setToken(null);
      }
    } catch {
      tokenStorage.remove();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(username, password);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);
    setToken(null);
  };

  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    logout,
    refreshUser,
  }), [user, token, isLoading, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
