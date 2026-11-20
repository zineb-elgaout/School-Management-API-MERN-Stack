import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, login as loginRequest } from '../api/auth';
import { clearToken, getToken, setToken } from '../api/client';
import { AuthContext } from './context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getCurrentUser();
        setUser(data.user);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);

    window.addEventListener('edunode:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('edunode:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginRequest(credentials);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
