import { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';
import { ServiceService } from '../services/serviceService';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getServices = async (name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true)
    try {
      const response = await ServiceService.getServices({ name, minDurationMinutes, maxDurationMinutes, minPrice, maxPrice, isActive, sortBy, isDescending, pageNumber, pageSize });
      setServices(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener los servicios", 'error');
    } finally {
      setLoading(false)
    }
  };

  const getService = async (serviceId) => {
    setLoading(true)
    try {
      const response = await ServiceService.getService(serviceId);
      setService(response || null);

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener el servicio", 'error');
    } finally {
      setLoading(false)
    }
  };

  const createService = async (name, description, durationMinutes) => {
    setLoading(true)
    try {
      console.log({ name, description, durationMinutes });
      const response = await ServiceService.createService({ name, description, durationMinutes });
      setService(response || null);
      addNotification("Servicio creado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al crear el servicio", 'error')
    } finally {
      setLoading(false)
    }
  };

  const updateService = async (serviceId, name, description, durationMinutes) => {
    setLoading(true)
    try {
      const response = await ServiceService.updateService(serviceId, { name, description, durationMinutes });
      addNotification("Servicio actualizado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar el servicio", 'error')
    } finally {
      setLoading(false)
    }
  };

  const changeStatusService = async (serviceId, status) => {
    setLoading(true)
    try {
      const response = await ServiceService.chagenStatusService(serviceId, { isActive: status });
      addNotification("El servicio ha cambiado de estado", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar el estado del servicio", 'error')
    } finally {
      setLoading(false)
    }
  };

  const uploadServiceImages = async (serviceId, files) => {
    setLoading(true);
    try {
      const response = await ServiceService.uploadImages(serviceId, files);
      addNotification("Imágenes subidas con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al subir las imágenes", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceImage = async (serviceId, imageId) => {
    setLoading(true);
    try {
      await ServiceService.deleteImage(serviceId, imageId);
      addNotification("Imagen eliminada con éxito", 'success');
      return true;
    } catch (error) {
      addNotification(error.message || "Error al eliminar la imagen", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServicesContext.Provider value={{ services, service, loading, pagination, getServices, getService, createService, updateService, changeStatusService, uploadServiceImages, deleteServiceImage }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useService = () => useContext(ServicesContext);