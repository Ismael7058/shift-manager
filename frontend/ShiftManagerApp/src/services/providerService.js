const API_URL = "http://localhost:5256/providers";

export const providersRequest = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.Name) params.append('Name', filters.Name);
  if (filters.SortBy) params.append('SortBy', filters.SortBy);
  params.append('IsDescending', filters.IsDescending ?? false);
  params.append('IncludeServices', filters.IncludeServices ?? false);
  params.append('IncludeWorkSchedules', filters.IncludeWorkSchedules ?? false);
  params.append('IncludeRestrictedDates', filters.IncludeRestrictedDates ?? false);
  params.append('PageNumber', filters.PageNumber ?? 1);
  params.append('PageSize', filters.PageSize ?? 10);

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los proveedores');
  }

  return response.json();
};
