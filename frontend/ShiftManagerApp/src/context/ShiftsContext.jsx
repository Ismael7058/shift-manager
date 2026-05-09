import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { MyShiftsProvider, MyShiftsContext } from '../context/MyShiftsContext';
import ShiftsPage from '../pages/ShiftsPage';
import { useNotification } from './NotificationContext';
import { handleApiError } from '../utils/apiErrorHandler';

export const ShiftsContext = createContext();

// 1. Definimos el ShiftsProvider (Vista General para Admin/Recepción)
export const ShiftsProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { expireSession } = useAuth();
  const { addNotification } = useNotification();

  const fetchAllShifts = useCallback(async (filters) => {
    setLoading(true);
    try {
      const formattedFilters = {
        ...filters,
        dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00Z` : undefined,
        dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59Z` : undefined,
      };

    } catch (err) {
      const errorMsg = handleApiError(err, expireSession);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [expireSession, addNotification]);

  const [pagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  return (
    <ShiftsContext.Provider value={{ 
      shifts, 
      loading, 
      error: null, 
      pagination, 
      fetchShifts: fetchAllShifts, 
      isGlobal: true 
    }}>
      {children}
    </ShiftsContext.Provider>
  );
};

export const useTurnos = () => {
  const personal = useContext(MyShiftsContext);
  const global = useContext(ShiftsContext);
  return personal || global;
};

export const useShifts = () => useContext(ShiftsContext);

const ShiftsContent = () => {
  const { user } = useAuth();
  const isPersonalRole = user && ["Cliente", "Proveedor"].includes(user.roleActive);

  return isPersonalRole ? (
    <MyShiftsProvider>
      <ShiftsPage />
    </MyShiftsProvider>
  ) : (
    <ShiftsProvider>
      <ShiftsPage />
    </ShiftsProvider>
  );
};

export default ShiftsContent;
