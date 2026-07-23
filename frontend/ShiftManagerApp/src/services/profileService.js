import { apiFetch } from "./api";

export const ProfileService = {

  /**
   * Obtiene los datos del usuario autenticado
   * @returns {Promise<UserDto>}
   */
  getMe: () =>
    apiFetch('/me'),

  /**
   * Actualiza los datos personales
   * @param {UpdateUserDto} update
   * @returns {Promise<any>}
   */
  updateMe: (update) =>
    apiFetch(
      '/me',
      {
        method: 'PUT',
        body: JSON.stringify(update)
      }
    ),

  /**
   * Actualiza el email personal
   * @param {EditEmailDto} editEmail 
   * @returns {Promise<any>}
   */
  editEmail: (editEmail) =>
    apiFetch(
      '/me/email',
      {
        method: 'PATCH',
        body: JSON.stringify(editEmail)
      }
    ),

  /**
   * Actualiza el username personal
   * @param {EditUsernameDto} editUsername 
   * @returns {Promise<any>}
   */
  editUsername: (editUsername) =>
    apiFetch(
      '/me/username',
      {
        method: 'PATCH',
        body: JSON.stringify(editUsername)
      }
    ),

  /**
   * Actualiza el username personal
   * @param {EditPasswordProfileDto} editPassword 
   * @returns {Promise<any>}
   */
  editPassword: (editPassword) =>
    apiFetch(
      '/me/password',
      {
        method: 'PATCH',
        body: JSON.stringify(editPassword)
      }
    ),

  /**
   * Cambiar el rol activo del usuario
   * @param {RoleDto} role 
   * @returns {Promise<any>}
   */
  changeRoleActive: (role) =>
    apiFetch(
      '/me/role-active',
      {
        method: 'PATCH',
        body: JSON.stringify(role)
      }
    ),

  /**
   * Actualizar o eliminar la foto de perfil
   * @param {File} file 
  * @returns {Promise<string>}
   */
  updatePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch(
      '/me/picture',
      {
        method: 'POST',
        body: formData
      }
    );
  },

  /**
   * Elimina la imagen de perfil
   * @returns {Promise<any>}
   */
  deletePicture: () =>
    apiFetch(
      `/me/picture`,
      {
        method: 'DELETE'
      }
    ),
};
