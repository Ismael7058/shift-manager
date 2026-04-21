import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginRequest, logoutRequest } from '../services/authService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isManualLogout, setIsManualLogout] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
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
    return data;
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
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, expireSession, isManualLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
