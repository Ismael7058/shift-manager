import { createContext, useContext, useState, useCallback } from 'react';
import { myShiftsRequest } from '../services/myShiftService';

const MyShiftsContext = createContext();

export const MyShiftsProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const fetchMyShifts = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await myShiftsRequest(filters);
      setShifts(data.items);
      setPagination({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MyShiftsContext.Provider value={{ shifts, loading, error, pagination, fetchMyShifts }}>
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
