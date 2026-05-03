import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { myShiftsRequest, getMeShiftByIdRequest, createShiftRequest, changeStatusRequest } from '../services/myShiftService';
import { handleApiError } from '../utils/apiErrorHandler';

export const MyShiftsContext = createContext();

export const MyShiftsProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
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

  const fetchMyShifts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const formattedFilters = {
        ...filters,
        dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00Z` : undefined,
        dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59Z` : undefined,
      };

      const data = await myShiftsRequest(formattedFilters);
      setShifts(data.items);
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

  const fetchMyShiftById = useCallback(async (id) =>{
    setLoading(true);
    setError(null);
    try {
      const data = await getMeShiftByIdRequest(id);
      return data;
    } catch (err) {
      const errorMsg = handleApiError(err, expireSession );
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [expireSession , addNotification]);

  const fetchCreateShift = useCallback(async (shiftCreate) =>{
    setLoading(true);
    setError(null);
    try {
      const data = await createShiftRequest(shiftCreate);
      addNotification("Turno creado con éxito", 'success');
      await fetchMyShifts();
    } catch (err) {
      const errorMsg = handleApiError(err, expireSession );
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [expireSession , addNotification]);

    const fetchChangeStatusShift = useCallback(async (id, status) =>{
    setLoading(true);
    setError(null);
    try {
      const validStatuses = ['pending', 'confirmed', 'completed', 'canceled'];
      if (!validStatuses.includes(status.toLowerCase())){
        addNotification("Error el estado ingresado es invalido", 'error');
        return;
      }
      
      await changeStatusRequest(id, status);
      addNotification("Estado actualizado", 'success');
      await fetchMyShifts();
    } catch (err) {
      const errorMsg = handleApiError(err, expireSession );
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [expireSession , addNotification]);

  return (
    <MyShiftsContext.Provider value={{ 
      shifts, 
      loading, 
      error, 
      pagination, 
      fetchShifts: fetchMyShifts, 
      fetchShiftById: fetchMyShiftById,
      createShift: fetchCreateShift,
      changeStatus: fetchChangeStatusShift,
      isGlobal: false 
    }}>
      {children}
    </MyShiftsContext.Provider>
  );
};

export const useMyShifts = () => {
  const context = useContext(MyShiftsContext);
  if (!context) {
    throw new Error('useMyShifts debe usarse dentro de un MyShiftsProvider');
  }
  return context;
};
