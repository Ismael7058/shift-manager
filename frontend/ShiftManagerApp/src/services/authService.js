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
        body: JSON.stringify({ Identifier: credentials.identifier, Password: credentials.password })
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
        body: JSON.stringify({
          FirstName: register.firstName,
          LastName: register.lastName,
          DateOfBirth: register.dateOfBirth,
          Gender: register.gender,
          PhoneNumber: register.phoneNumber,
          Username: register.username,
          Email: register.email,
          Password: register.password,
          ConfirmPassword: register.confirmPassword
        })
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
