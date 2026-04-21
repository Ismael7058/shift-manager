import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { servicesRequest } from '../services/serviceService';
import { handleApiError } from '../utils/apiErrorHandler';

const ServicesContext = createContext();

export const Services = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();
  const { logoutUser } = useAuth();
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const fetchServices = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesRequest(filters);
      setServices(data.items);
      setPagination({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
      });
    } catch (err) {
      const errorMsg = handleApiError(err, logoutUser);
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [logoutUser, addNotification]);

  return (
    <ServicesContext.Provider value={{ services, loading, error, pagination, fetchServices }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useService debe usarse dentro de un proveedor de Services');
  }
  return context;
};