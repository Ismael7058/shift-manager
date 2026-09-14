import { apiFetch } from "./api";

export const RoleService = {
  /**
   * Obtiene una lista de todos los roles
   * @returns {Promise<Array<string>>}
   */
  getRoles: () =>
    apiFetch('/role')
};
