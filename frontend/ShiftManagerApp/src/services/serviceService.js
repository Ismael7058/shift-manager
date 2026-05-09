const API_URL = "http://localhost:5256";

/**
 * Obtiene los Servicios.
 * @param {import('../models/shiftModels').ServiceFilterDto} filters
 * @returns {Promise<import('../models/shiftModels').PaginatedDto<import('../models/shiftModels').ServiceDto>>}
 */
export const servicesRequest = async (filters = {}) => {
  const params = new URLSearchParams();
  
  params.append('SortBy', filters.sortBy);
  params.append('IsDescending', filters.isDescending ?? true);
  params.append('PageNumber', filters.pageNumber ?? 1);
  params.append('PageSize', filters.pageSize ?? 10);
  
  if (filters.name) params.append('Name', filters.name);
  if (filters.isActive) params.append('IsActive', filters.isActive);

  const response = await fetch(`${API_URL}/services?${params.toString()}`, {
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
