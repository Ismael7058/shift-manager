import { apiFetch } from "./api";

export const WorkSchedulesService = {

  /**
   * Obtiene una lista de los horarios de trabajo de un proveedor
   * @param {WorkSchedulesFilterDto} filter 
   * @returns {Promise<PaginatedDto<WorkSchedulesDto>>}
   */
  getAllWorkSchedules: (filter) =>
    apiFetch(`/work-schedules?DayOfWeek=${filter.dayOfWeek}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`),

  /**
   * Obtiene un horario de trabajo a partir de su id
   * @param {number} workId 
   * @returns {Promise<WorkSchedulesDto>}
   */
  getWorkSchedule: (workId) =>
    apiFetch(`/work-schedules/${workId}`),

  /**
   * Crea un horario de trabajo a un proveedor
   * @param {number} providerId 
   * @param {CreateWorkSchedulesDto} create 
   * @returns {Promise<WorkSchedulesDto>}
   */
  createWorkSchedule: (providerId, create) =>
    apiFetch(
      `/work-schedules?providerId=${providerId}`,
      {
        method: 'POST',
        body: JSON.stringify(create)
      }
    ),

  /**
   * Actualiza el horario de trabajo de un proveedor
   * @param {number} workId 
   * @param {UpdateWorkSchedulesDto} update 
   * @returns 
   */
  updateWorkSchedule: (workId, update) =>
    apiFetch(
      `/work-schedules/${workId}`,
      {
        method: 'PUT',
        body: JSON.stringify(update)
      }      
    ),

  /**
   * Actualiza el estado logico de un horario de trabajo
   * @param {number} workId 
   * @param {UpdateStatusDto} status 
   * @returns 
   */
  changeStatusWorkSchedule: (workId, status) =>
    apiFetch(
      `/work-schedules/${workId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(status)
      }
    )
};
