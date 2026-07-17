import { apiFetch } from "./api";

export const ProviderService = {

  /**
   * Obtiene una lista de proveedores disponibles
   * @param {ProviderFilterDto} filter 
   * @returns {Promise<PaginatedDto<ProviderDto>>}
   */
  getProviders: (filter) =>
    apiFetch(`/providers?Name=${filter.name}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`),

  /**
   * Obtiene una lista de los servicios de un proveedor disponibles
   * @param {number} providerId 
   * @param {ProviderServiceFilterDto} filter 
   * @returns {Promise<PaginatedDto<ProviderServiceDto>>}
   */
  getServicesOfProvider: (providerId, filter) =>
    apiFetch(`/providers/${providerId}/services?&Name=${filter.name}&MinDurationMinutes=${filter.minDurationMinutes}&MaxDurationMinutes=${filter.maxDurationMinutes}&MinPrice=${filter.minPrice}&MaxPrice=${filter.maxPrice}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}`)
};
