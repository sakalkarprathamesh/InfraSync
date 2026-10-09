import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoUser } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchDemoUser: (demoUser: DemoUser) => Promise<void>;
  isAdmin: boolean;
  isDepartmentUser: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('infrasync_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('infrasync_token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error("Failed to load user profile", err);
          localStorage.removeItem('infrasync_token');
          setToken(null);
          setUser(null);
        }
      }
      try {
        const demos = await api.getDemoUsers();
        if (demos.length > 0) {
          const defaultAdmin = demos.find((d) => d.role === 'admin') || demos[0];
          const res = await api.login({ email: defaultAdmin.email, password: defaultAdmin.demo_password });
          localStorage.setItem('infrasync_token', res.access_token);
          setToken(res.access_token);
          setUser(res.user);
        }
      } catch (err) {
        console.error("Auto demo login initialization fallback", err);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('infrasync_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('infrasync_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (demoUser: DemoUser) => {
    await login(demoUser.email, demoUser.demo_password);
  };

  const isAdmin = user?.role === 'admin';
  const isDepartmentUser = user?.role === 'department_user' || isAdmin;
  const isViewer = user?.role === 'viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        switchDemoUser,
        isAdmin,
        isDepartmentUser,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
