const API_URL = "http://localhost:5256/me/shifts";

/**
 * Obtiene los turnos del usuario autenticado
 * @param {import('../models/shiftModels').ShiftFilterDto} filters
 * @returns {Promise<import('../models/shiftModels').PaginatedDto<import('../models/shiftModels').ShiftDto>>}
 */
export const myShiftsRequest = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.searchTerm) params.append('SearchTerm', filters.searchTerm);
  if (filters.sortBy) params.append('SortBy', filters.sortBy);
  if (filters.isDescending !== undefined) params.append('IsDescending', filters.isDescending);
  if (filters.pageNumber) params.append('PageNumber', filters.pageNumber);
  if (filters.pageSize) params.append('PageSize', filters.pageSize);

  if (filters.dateFrom) params.append('DateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('DateTo', filters.dateTo);
  if (filters.minPrice) params.append('MinPrice', filters.minPrice);
  if (filters.maxPrice) params.append('MaxPrice', filters.maxPrice);
  if (filters.serviceId) params.append('ServiceId', filters.serviceId);
  
  filters.statuses?.forEach(status => params.append('Statuses', status));

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener mis turnos');
  }

  return response.json();
};

/**
 * Obtiene el detalle de un turno específico por ID
 * @param {string|number} id 
 * @returns {Promise<import('../models/shiftModels').ShiftDto>}
 */
export const getMeShiftByIdRequest = async (id) => {
  // Usamos el ID como parámetro de ruta siguiendo la convención REST
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener el detalle de mi turno');
  }

  return response.json();
};

/**
 * Crear un turno nuevo
 * @param {import('../models/shiftModels').ShiftCreateDto} shiftCreate - Datos para la creación del turno
 * @returns {Promise<import('../models/shiftModels').ShiftDto>}
 */
export const createShiftRequest = async (shiftCreate) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(shiftCreate)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear un turno nuevo');
  }

  return response.json();
};

/**
 * Cambiar el estado de un turno
 * @param {string|number} id 
 * @param {import('../models/shiftModels').ShiftStatuses} status - Nuevo estado del turno
 */
export const changeStatusRequest = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al cambiar el estado del turno');
  }

  return response.json();
};