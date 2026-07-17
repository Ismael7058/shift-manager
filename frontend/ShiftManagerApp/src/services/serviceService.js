import { apiFetch } from "./api";

export const ServiceService = {
  /**
   * Obtiene una lista de servicios
   * @param {ServiceFilterDto} filter
   * @returns {Promise<PaginatedDto<ServiceDto>>}
   */
  getServices: (filter) =>
    apiFetch(`/services?Name=${filter.name}&MinDurationMinutes=${filter.minDurationMinutes}&MaxDurationMinutes=${filter.maxDurationMinutes}&MinPrice=${filter.minPrice}&MaxPrice=${filter.maxPrice}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}`),

  /**
   * Obtiene un servicio por id
   * @param {number} serviceId 
   * @returns {Promise<ServiceDto>}
   */
  getService: (serviceId) =>
    apiFetch(`/services/${serviceId}`),

  /**
   * Actualiza un servicio
   * @param {number} serviceId 
   * @param {UpdateServiceDto} update
   * @returns {Promise<ServiceDto>}
   */
  upadateService: (serviceId, update) =>
    apiFetch(
      `/services/${serviceId}`,
      {
        method: 'PUT',
        body: JSON.stringify(update)
      }
    ),

  /**
   * Cambia el estado de un servicio
   * @param {number} serviceId 
   * @param {UpdateStatusDto} status
   * @returns {Promise<any>}
   */
  chageStatusService: (serviceId, status) =>
    apiFetch(
      `/services/${serviceId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(status)
      }
    )
};
