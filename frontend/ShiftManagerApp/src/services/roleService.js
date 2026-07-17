import { apiFetch } from "./api";

export const ClientService = {
  /**
   * Obtiene una lista de todos los roles
   * @returns {Promise<Array<string>>}
   */
  getClients: () =>
    apiFetch('role')
};
