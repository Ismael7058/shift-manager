import { apiFetch } from "./api";

export const ShiftService = {
  /**
   * Obtiene una lista de turnos
   * @param {number} providerId
   * @param {number} clientId
   * @param {ShiftFilterDto} filter 
   * @returns {Promise<PaginatedDto<ClientDto>>}
   */
  getShifts: (providerId, clientId, filter) =>
    apiFetch(`/shifts?providerId=${providerId}&clientId=${clientId}&ServiceId=${filter.serviceId}&DateFrom=${filter.dateFrom}&DateTo=${filter.dateTo}&MinPrice=${filter.minPrice}&MaxPRice=${filter.maxPrice}&Statuses=${filter.statuses}&ProviderName=${filter.providerName}&ClientName=${filter.clientName}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`),

  /**
   * Obtiene un turno por id
   * @param {number} shiftId 
   * @returns {Promise<ShiftDto>}
   */
  getShift: (shiftId) =>
    apiFetch(`/shifts/${shiftId}`),

  /**
   * Crear un turno
   * @param {number} clientId 
   * @param {CreateShiftDto} create 
   * @returns {Promise<ShiftDto>}
   */
  createShift: (clientId, create) =>
    apiFetch(
      `/shifts?clientId=${clientId}`,
      {
        method: 'POST',
        body: JSON.stringify(create)
      }
    ),

  /**
   * Actualizar un turno
   * @param {number} shiftId 
   * @param {UpdateShiftDto} upadate 
   * @returns {Promise<any>}
   */
  updateShift: (shiftId, upadate) =>
    apiFetch(
      `/shifts/${shiftId}`,
      {
        method: 'PUT',
        body: JSON.stringify(upadate)
      }
    ),

  /**
   * Cambia los estados de un turno
   * @param {number} shiftId 
   * @param {ShiftStatus} status 
   * @returns 
   */
  changeStatusShift: (shiftId, status) =>
    apiFetch(
      `/shifts/${shiftId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(status)
      }
    )
};