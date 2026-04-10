'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, loginUser, registerUser, logoutUser, setCurrentUser as storeSetCurrentUser } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => ({ success: false }),
  register: () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const result = loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const register = (name: string, email: string, password: string) => {
    const result = registerUser(name, email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
