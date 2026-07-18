import { apiFetch } from "./api";

export const ProviderServiceService = {

  /**
   * Obtiene una lista de servicios de proveedores
   * @param {number} providerId
   * @param {number} serviceId
   * @param {ProviderServiceFilterDto} filter
   * @returns {Promise<PaginatedDto<ProviderServiceDto>>}
   */
  getAllServiceOfProvider: (providerId, serviceId, filter) =>
    apiFetch(`/provider-service?providerId=${providerId}&serviceId=${serviceId}&Name=${filter.name}&MinDurationMinutes=${filter.minDurationMinutes}&MaxDurationMinutes=${filter.maxDurationMinutes}&MinPrice=${filter.minPrice}&MaxPrice=${filter.maxPrice}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}`),

  /**
   * Obtiene un de servicio de un proveedor
   * @param {number} serviceId
   * @param {number} providerId
   * @returns {Promise<ProviderServiceDto>}
   */
  getServiceOfProvider: (serviceId, providerId) =>
    apiFetch(`/provider-service/${serviceId}?providerId=${providerId}`),

  /**
   * 
   * @param {number} providerId 
   * @param {CreateProviderServiceDto} create 
   * @returns {Promise<ProviderServiceDto>}
   */
  createServiceOfProvider: (providerId, create) =>
    apiFetch(
      `/provider-service?providerId=${providerId}`,
      {
        method: 'POST',
        body: JSON.stringify(create)
      }
    ),

  /**
   * Acutaliza los datos de un de servicio de un proveedor
   * @param {number} serviceId
   * @param {number} providerId
   * @param {UpdateProviderServiceDto} update
   * @returns {Promise<ProviderServiceDto>}
   */
  updateServiceOfProvider: (serviceId, providerId, update) =>
    apiFetch(
      `/provider-service/${serviceId}?providerId=${providerId}`,
      {
        method: 'PUT',
        body: JSON.stringify(update)
      }
    ),
  
  /**
   * Desactiva un servicio de un proveedor
   * @param {number} serviceId
   * @param {number} providerId
   * @returns {Promise<any>}
   */
  softDeleteServiceOfProvider: (serviceId, providerId) =>
    apiFetch(
      `/provider-service/${serviceId}?providerId=${providerId}`,
      {
        method: 'PATCH'
      }
    ),

  /**
   * Activa un servicio de un proveedor
   * @param {number} serviceId
   * @param {number} providerId
   * @returns {Promise<any>}
   */
  activeServiceOfProvider: (serviceId, providerId) =>
    apiFetch(
      `/provider-service/${serviceId}/active?providerId=${providerId}`,
      {
        method: 'PATCH'
      }
    )
};
