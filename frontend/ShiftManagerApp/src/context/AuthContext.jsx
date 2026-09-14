import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/authService'
import { handleApiError } from '../utils/apiErrorHandler';
import { useNotification } from './NotificationContext';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addNotification } = useNotification();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await AuthService.login(identifier, password);

      if (response && response.user) {
        setUser({ ...response.user, roleActive: response.roleActive });
        localStorage.setItem('user', JSON.stringify({ ...response.user, roleActive: response.roleActive }));
        addNotification(`¡Bienvenido, ${response.user.firstName} ${response.user.lastName}!`, 'success');
      }
      return response;
    } catch (error) {
      addNotification(error?.message || 'Credenciales invalidas', 'error');
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      addNotification(error?.message || 'Error al cerrar sesion', 'error');
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        addNotification(`¡Bienvenido, ${response.user.firstName} ${response.user.lastName}!`, 'success');
      }
      return response;
    } catch (error) {
      addNotification(error?.message || 'Error al registrar', 'error');
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
