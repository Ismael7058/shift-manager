import { createContext, useContext, useState, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { ProviderService } from '../services/providerService';

export const ProviderContext = createContext();

export const ProviderProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [providers, setProviders] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getProviders = async (name, sortBy, isDescending, includeServices, includeWorkSchedules, includeRestrictedDates, pageNumber = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await ProviderService.getProviders({ name, sortBy, isDescending, includeServices, includeWorkSchedules, includeRestrictedDates, pageNumber, pageSize });

      setProviders(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener los proveedores", 'error');
    } finally {
      setLoading(false);
    };
  };

  const getServicesOfProvider = async (providerId, name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await ProviderService.getServicesOfProvider(providerId, { name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber, pageSize });

      setProviderServices(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener los servicios del proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const getProviderById = async (providerId) => {
    setLoading(true);
    try {
      const response = await ProviderService.getProviderById(providerId);
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener el proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const getRestrictedDates = async (providerId, dateFrom, dateTo) => {
    try {
      const response = await ProviderService.getRestrictedDates(providerId, dateFrom, dateTo);
      return response || [];
    } catch (error) {
      addNotification(error?.message || "Error al obtener la disponibilidad del proveedor", 'error');
      return [];
    }
  };

  return (
    <ProviderContext.Provider value={{ providers, providerServices, loading, pagination, getProviders, getServicesOfProvider, getProviderById, getRestrictedDates }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = () => useContext(ProviderContext); 
