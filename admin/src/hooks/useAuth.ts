import { useEffect, useState } from 'react';

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
};

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    setAuth({
      isAuthenticated: !!token,
      token,
      isLoading: false,
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAuth({
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  };

  return { ...auth, logout };
};
