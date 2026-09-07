import { apiFetch } from "./api";

export const ProviderService = {

  /**
   * Obtiene una lista de proveedores disponibles
   * @param {ProviderFilterDto} filter 
   * @returns {Promise<PaginatedDto<ProviderDto>>}
   */
  getProviders: (filter) =>
    apiFetch(`/providers?Name=${filter.name}&IncludeWorkSchedules=${filter.includeWorkSchedules}&IncludeServices=${filter.includeServices}&IncludeRestrictedDates=${filter.includeRestrictedDates}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`),

  /**
   * Obtiene una lista de los servicios de un proveedor disponibles
   * @param {number} providerId 
   * @param {ProviderServiceFilterDto} filter 
   * @returns {Promise<PaginatedDto<ProviderServiceDto>>}
   */
  getServicesOfProvider: (providerId, filter) =>
    apiFetch(`/providers/${providerId}/services?&Name=${filter.name}&MinDurationMinutes=${filter.minDurationMinutes}&MaxDurationMinutes=${filter.maxDurationMinutes}&MinPrice=${filter.minPrice}&MaxPrice=${filter.maxPrice}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}`),


  /**
   * Obtiene un proveedor por ID
   * @param {number} providerId 
   * @returns {Promise<ProviderDto>}
   */
  getProviderById: (providerId) =>
    apiFetch(`/providers/${providerId}`),

  /**
   * Obtiene las fechas no disponibles / turnos ocupados de un proveedor
   * @param {number} providerId 
   * @param {string} [dateFrom]
   * @param {string} [dateTo]
   * @returns {Promise<DateRangeDto[]>}
   */
  getRestrictedDates: (providerId, dateFrom, dateTo) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/providers/${providerId}/restricted-dates${query}`);
  }
};
