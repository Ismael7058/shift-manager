import { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';
import { WorkSchedulesService } from '../services/workSchedulesService';

const WorkSchedulesContext = createContext();

export const WorkSchedulesProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [workSchedules, setWorkSchedules] = useState([]);
  const [workSchedule, setWorkSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getAllWorkSchedules = async (providerId, dayOfWeek, isActive, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true)
    try {
      const response = await WorkSchedulesService.getAllWorkSchedules({ providerId, dayOfWeek, isActive, sortBy, isDescending, pageNumber, pageSize });
      setWorkSchedules(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener los horarios de trabajo", 'error');
    } finally {
      setLoading(false)
    }
  };

  const getWorkSchedule = async (workId) => {
    setLoading(true)
    try {
      const response = await WorkSchedulesService.getWorkSchedule(workId);
      setWorkSchedule(response || null);

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al obtener el horario de trabajo", 'error');
    } finally {
      setLoading(false)
    }
  };

  const createWorkSchedule = async (providerId, dayOfWeek, startTime, endTime) => {
    setLoading(true)
    try {
      const response = await WorkSchedulesService.createWorkSchedule(providerId, { dayOfWeek, startTime, endTime });
      setWorkSchedule(response || null);
      addNotification(response?.message || "Horario de trabajo registrado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al crear el horario de trabajo", 'error');
    } finally {
      setLoading(false)
    }
  };

  const updateWorkSchedule = async (workId, dayOfWeek, startTime, endTime) => {
    setLoading(true)
    try {
      const response = await WorkSchedulesService.updateWorkSchedule(workId, { dayOfWeek, startTime, endTime });
      addNotification(response?.message || "Horario de trabajo actualizado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al actualizar el horario de trabajo", 'error');
    } finally {
      setLoading(false)
    }
  };

  const changeStatusWorkSchedule = async (workId, status) => {
    setLoading(true)
    try {
      const response = await WorkSchedulesService.changeStatusWorkSchedule(workId, { isActive: status });
      addNotification(response?.message || "El estado del horario de trabajo ha cambiado", 'success');

      return response;
    } catch (error) {
      addNotification(error?.message || "Error al cambiar el estado del horario de trabajo", 'error');
    } finally {
      setLoading(false)
    }
  };

  return (
    <WorkSchedulesContext.Provider value={{ workSchedules, workSchedule, loading, pagination, getAllWorkSchedules, getWorkSchedule, createWorkSchedule, updateWorkSchedule, changeStatusWorkSchedule }}>
      {children}
    </WorkSchedulesContext.Provider>
  )
};

export const useWorkSchedules = () => useContext(WorkSchedulesContext);
