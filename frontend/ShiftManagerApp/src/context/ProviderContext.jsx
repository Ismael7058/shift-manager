import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { providersRequest } from '../services/providerService';
import { handleApiError } from '../utils/apiErrorHandler';

export const ProviderContext = createContext();

export const ProviderProvider = ({ children }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { expireSession  } = useAuth();
  const { addNotification } = useNotification();
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const fetchProviders = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await providersRequest(filters);
      setProviders(data.items);
      setPagination({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
      });
    } catch (err) {
      const errorMsg = handleApiError(err, expireSession );
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [expireSession , addNotification]);

  return (
    <ProviderContext.Provider value={{ 
      providers,
      loading,
      error,
      pagination,
      fetchProviders
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider debe usarse dentro de un ProviderProvider');
  }
  return context;
};
