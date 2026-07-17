import { apiFetch } from "./api";

export const AuthService = {
  /**
   * Inicia sesión y almacena el usuario autenticado.
   * @param {LoginDto} credentials 
   * @returns {Promise<{user: UserDto, expiration: string, roleActive: string}>}
   */
  login: (credentials) =>
    apiFetch(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials)
      }
    ),

    /**
     * Registrarse como Cliente
     * @param {RegisterDto} register 
     * @returns {Promise<{user: UserDto, expiration: string, roleActive: string}>}
     */
    register: (register) => 
      apiFetch(
        '/register',
        {
          method: 'POST',
          body: JSON.stringify(register)
        }
      ),

    /**
     * Cerrar sesion
     * @returns {Promise<any>}
     */
    logout: () =>
      apiFetch(
        '/logout',
        {
          method: 'POST'
        }
      )
};
