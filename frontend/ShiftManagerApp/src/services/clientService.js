import { apiFetch } from "./api";

export const ClientService = {

  /**
   * Obtiene una lista de clientes disponibles
   * @param {ClientFilterDto} filter 
   * @returns {Promise<PaginatedDto<ClientDto>>}
   */
  getClients: (filter) =>
    apiFetch(`/clients?Name=${filter.name}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`)
};
