import { apiFetch } from "./api";

export const UserService = {

  /**
   * Obtiene una lista de usuarios
   * @param {UserFilterDto} filter 
   * @returns {Promise<PaginatedDto<UserDto>>}
   */
  getUsers: (filter) =>
    apiFetch(`/users?Name=${filter.name}&Email=${filter.email}&Username=${filter.username}&Role=${filter.role}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&$PageSize=${filter.pageSize}`),

  /**
   * Crea un usuario
   * @param {CreateUserDto} create 
   * @returns {Promise<UserDto>}
   */
  createUser: (create) =>
    apiFetch(
      '/users',
      {
        method: 'POST',
        body: JSON.stringify({
          FirstName: create.firstName,
          LastName: create.lastName,
          DateOfBirth: create.dateOfBirth,
          Gender: create.gender,
          PhoneNumber: create.phoneNumber,
          Username: create.username,
          Email: create.email,
          Password: create.password,
          ConfirmPassword: create.confirmPassword,
          RolesId: create.rolesId
        })
      }
    ),

  /**
   * Obtener un usuario por id
   * @param {number} userId 
   * @returns {Promise<UserDto>}
   */
  getUser: (userId) =>
    apiFetch(`/users/${userId}`),

  /**
   * Actualiza un usuario por id
   * @param {number} userId 
   * @param {UpdateUserDto} update
   * @returns {Promise<UserDto>}
   */
  updateUser: (userId, update) =>
    apiFetch(
      `/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          {
            FirstName: update.firstName,
            LastName: update.lastName,
            DateOfBirth: update.dateOfBirth,
            Gender: update.gender,
            PhoneNumber: update.phoneNumber,
          }
        )
      }
    ),

  /**
   * Cambia el email de un usuario
   * @param {number} userId 
   * @param {EditEmailDto} email 
   * @returns {Promise<any>}
   */
  editEmailUser: (userId, email) =>
    apiFetch(
      `/users/${userId}/email`,
      {
        method: 'PATCH',
        body: JSON.stringify(email)
      }
    ),

  /**
   * Cambia el username de un usuario
   * @param {number} userId 
   * @param {EditUsernameDto} username 
   * @returns {Promise<any>}
   */
  editUsernameUser: (userId, username) =>
    apiFetch(
      `/users/${userId}/username`,
      {
        method: 'PATCH',
        body: JSON.stringify(username)
      }
    ),

  /**
   * Cambia la clave de un usuario
   * @param {number} userId 
   * @param {EditPasswordDto} password 
   * @returns {Promise<any>}
   */
  editPasswordUser: (userId, password) =>
    apiFetch(
      `/users/${userId}/password`,
      {
        method: 'PATCH',
        body: JSON.stringify({ newPassword: password.newPassword, confirmPassword: password.confirmPassword })
      }
    ),

  /**
   * Actualizar o eliminar la foto de perfil
   * @param {number} userId
   * @param {File} file 
   * @returns {Promise<string>}
  */
  updatePictureUser: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch(
      `/users/${userId}/picture`,
      {
        method: 'POST',
        body: formData
      }
    );
  },

  /**
   * Elimina la imagen de un usuario
   * @param {number} userId 
   * @returns {Promise<any>}
   */
  deletePictureUser: (userId) =>
    apiFetch(
      `/users/${userId}/picture`,
      {
        method: 'DELETE'
      }
    ),

  /**
   * Cambia los roles de un usuario
   * @param {number} userId 
   * @param {number[]} roles 
   * @returns {Promise<any>}
   */
  editRoleUser: (userId, roles) =>
    apiFetch(
      `/users/${userId}/role`,
      {
        method: 'PATCH',
        body: JSON.stringify(roles)
      }
    ),

  /**
   * Cambia el estado logico de un usuario
   * @param {number} userId 
   * @param {UpdateStatusDto} status
   * @returns {Promise<any>}
   */
  changeStatusUser: (userId, status) =>
    apiFetch(
      `/users/${userId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(status)
      }
    ),
};
