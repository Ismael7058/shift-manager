import { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';
import { ProviderServiceService } from '../services/providerServiceService';

export const ProviderServiceContext = createContext();

export const ProviderServiceProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [providerServices, setProviderServices] = useState([]);
  const [providerService, setProviderService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getServicesOfProvider = async (providerId, serviceId, name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.getAllServiceOfProvider(providerId, serviceId, { name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber, pageSize });
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

  const getServiceOfProvider = async (serviceId, providerId) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.getServiceOfProvider(serviceId, providerId);
      setProviderService(response || null)
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener el servicio del proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const createServiceOfProvider = async (providerId, serviceId, durationMinutes, price) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.createServiceOfProvider(providerId, { serviceId, durationMinutes, price });
      setProviderService(response || null);
      addNotification(response?.message || "Servicio del proveedor creado correctamente", 'success');
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al crear el servicio del proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const updateServiceOfProvider = async (serviceId, providerId, durationMinutes, price) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.updateServiceOfProvider(serviceId, providerId, { durationMinutes, price });
      addNotification(response?.message || "Servicio del proveedor ha sido actualizado", 'success');
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al actualizar el servicio de un proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const softDeleteServiceOfProvider = async (serviceId, providerId) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.softDeleteServiceOfProvider(serviceId, providerId);
      setProviderService({ ...providerService, status: 0 });
      addNotification(response?.message || "Servicio del proveedor ha sido removido", 'success');
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al remover el servicio del proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  const activeServiceOfProvider = async (serviceId, providerId) => {
    setLoading(true);
    try {
      const response = await ProviderServiceService.activeServiceOfProvider(serviceId, providerId);
      setProviderService({ ...providerService, status: 1 });
      addNotification(response?.message || "Servicio del proveedor ha sido restaurado", 'success');
      return response;
    } catch (error) {
      addNotification(error?.message || "Error al restaurar el servicio del proveedor", 'error');
    } finally {
      setLoading(false);
    };
  };

  return (
    <ProviderServiceContext.Provider value={{ providerServices, providerService, loading, pagination, getServicesOfProvider, getServiceOfProvider, createServiceOfProvider, updateServiceOfProvider, softDeleteServiceOfProvider, activeServiceOfProvider }}>
      {children}
    </ProviderServiceContext.Provider>
  );
};

export const useProviderService = () => useContext(ProviderServiceContext);