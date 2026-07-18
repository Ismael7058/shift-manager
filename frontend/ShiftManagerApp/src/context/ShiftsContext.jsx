import React, { createContext, useContext, useState } from 'react';
import { ShiftService } from '../services/shiftsService'
import { useNotification } from './NotificationContext';

const ShiftsContext = createContext();

export const ShiftsProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [shifts, setShifts] = useState(null);
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 20
  });

  const getShifts = async (providerId, clientId, serviceId, dateFrom, dateTo, minPrice, maxPrice, statuses, providerName, clientName, sortBy, isDecending, pageNumber = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await ShiftService.getShifts(providerId, clientId, { serviceId, dateFrom, dateTo, minPrice, maxPrice, statuses, providerName, clientName, sortBy, isDecending, pageNumber, pageSize });

      setShifts(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener los turnos", 'error');
    } finally {
      setLoading(false);
    };
  };

  const getShift = async (shiftId) => {
    setLoading(true);
    try {
      const response = await ShiftService.getShift(shiftId);
      setShift(response.items || null);

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener el turno", 'error');
    } finally {
      setLoading(false);
    };
  };

  const createShift = async (clientId, providerId, startAt, items = []) => {
    setLoading(true);
    try {
      const response = await ShiftService.createShift(clientId, { providerId, startAt, items });
      setShift(response.items || null);
      addNotification(response.message || "Turno creado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al crear el turno", 'error');
    } finally {
      setLoading(false);
    };
  };

  const updateShift = async (shiftId, providerId, startAt, items = []) => {
    setLoading(true);
    try {
      const response = await ShiftService.updateShift(shiftId, { providerId, startAt, items });
      addNotification(response.message || "Turno actualizado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar el turno", 'error');
    } finally {
      setLoading(false);
    };
  };

  const changeStatusShift = async (shiftId, status) => {
    setLoading(true);
    try {
      const response = await ShiftService.updateShift(shiftId, status);
      setShift(response.items || null);
      addNotification(response.message || "El turno ha cambiado de estado", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar el estado del turno", 'error');
    } finally {
      setLoading(false);
    };
  };

  return (
    <ShiftsContext.Provider value={{ shifts, shift, loading, pagination, getShifts, getShift, createShift, updateShift, changeStatusShift }}>
      {children}
    </ShiftsContext.Provider>
  )
};

export const useShift = () => useContext(ShiftsContext);