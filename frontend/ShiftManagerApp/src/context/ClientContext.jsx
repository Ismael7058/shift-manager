import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ClientService } from '../services/clientService'
import { handleApiError } from '../utils/apiErrorHandler';
import { useNotification } from './NotificationContext';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getClients = async (name, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await ClientService.getClients({ name, sortBy, isDescending, pageNumber, pageSize })

      setClients(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });
    } catch (error) {
      addNotification(error.message || "Error al obtener los clientes", 'error');
    } finally {
      setLoading(false);
    };
  };

  return (
    <ClientContext.Provider value={{ clients, loading, pagination, getClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
