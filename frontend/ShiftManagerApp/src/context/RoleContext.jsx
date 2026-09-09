import { createContext, useContext, useState } from 'react';
import { RoleService } from '../services/roleService'
import { useNotification } from './NotificationContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRoles = async () => {
    setLoading(true);
    try {
      const response = await RoleService.getRoles();
      setRoles(response || []);

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener los roles", 'error');
    } finally {
      setLoading(false);
    };
  };

  return (
    <RoleContext.Provider value={{ roles, loading, getRoles }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);