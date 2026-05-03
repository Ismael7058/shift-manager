import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginRequest, logoutRequest } from '../services/authService'
import { handleApiError } from '../utils/apiErrorHandler';
import { useNotification } from './NotificationContext';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManualLogout, setIsManualLogout] = useState(false);
  const { addNotification } = useNotification();
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginRequest(credentials);
      if (data.user) {
        setIsManualLogout(false);
        const sessionData = {
          ...data.user,
          roleActive: data.roleActive,
          expiration: data.expiration
        };
        localStorage.setItem('user', JSON.stringify(sessionData));
        setUser(sessionData);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      addNotification(errorMsg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = useCallback(async () => {
    try {
      setIsManualLogout(true);
      await logoutRequest();
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  // Cerrar sesion por expiracion
  const expireSession = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    setIsManualLogout(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, loginUser, logoutUser, expireSession, isManualLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
