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
  params.append('IsDescending', filters.isDescending ?? true);
  params.append('PageNumber', filters.pageNumber ?? 1);
  params.append('PageSize', filters.pageSize ?? 10);

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
