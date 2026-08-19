import { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';
import { UserService } from '../services/userService';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const { user: userAuth, updateUser: updatedUserAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize: 10
  });

  const getUsers = async (name, email, username, role, isActive, sortBy, isDescending, pageNumber = 1, pageSize = 20) => {
    setLoading(true)
    try {
      const response = await UserService.getUsers({ name, email, username, role, isActive, sortBy, isDescending, pageNumber, pageSize });
      setUsers(response.items || []);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize
      });

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener los usuarios", 'error');
    } finally {
      setLoading(false)
    };
  };

  const getUser = async (userId) => {
    setLoading(true)
    try {
      const response = await UserService.getUser(userId);
      setUser(response || null);

      return response;
    } catch (error) {
      addNotification(error.message || "Error al obtener el usuario", 'error');
    } finally {
      setLoading(false)
    };
  };

  const createUser = async (firstName, lastName, dateOfBirth, gender, phoneNumber, username, email, password, confirmPassword, rolesId = []) => {
    setLoading(true)
    try {
      const response = await UserService.createUser({ firstName, lastName, dateOfBirth, gender, phoneNumber, username, email, password, confirmPassword, rolesId });
      setUser(response || null);
      addNotification(response.message || "Usuario registrado con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al registrar el usuario", 'error')
    } finally {
      setLoading(false)
    };
  };

  const updateUser = async (userId, firstName, lastName, dateOfBirth, gender, phoneNumber) => {
    setLoading(true);
    try {
      const response = await UserService.updateUser(userId, { firstName, lastName, dateOfBirth, gender, phoneNumber });
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, gender: gender, phoneNumber: phoneNumber };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, gender: gender, phoneNumber: phoneNumber };
        setUser(updatedUser);
      };

      addNotification("Usuario actualizado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar el usuario", 'error')
    } finally {
      setLoading(false)
    };
  };

  const editEmailUser = async (userId, email) => {
    setLoading(true)
    try {
      const response = await UserService.editEmailUser(userId, { email });
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, email: email };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, email: email };
        setUser(updatedUser);
      };

      addNotification("Email actualizado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar el email", 'error')
    } finally {
      setLoading(false)
    };
  };

  const editUsernameUser = async (userId, username) => {
    setLoading(true)
    try {
      const response = await UserService.editUsernameUser(userId, { username });
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, username: username };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, username: username };
        setUser(updatedUser);
      };

      addNotification("Username actualizado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar el username", 'error')
    } finally {
      setLoading(false)
    };
  };


  const editPasswordUser = async (userId, newPassword, confirmPassword) => {
    setLoading(true)
    try {
      const response = await UserService.editPasswordUser(userId, { newPassword, confirmPassword });
      addNotification("Contraseña actualizada con éxito", 'success');

      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar la contraseña", 'error')
    } finally {
      setLoading(false)
    };
  };

  const updatePictureUser = async (userId, file) => {
    setLoading(true);
    try {
      const response = await UserService.updatePictureUser(userId, file);
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, pictureURL: response.pictureURL };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, pictureURL: response.pictureURL };
        setUser(updatedUser);
      }
      addNotification("Imagen del usuario actualizada", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar la imagen del usuario", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePictureUser = async (userId) => {
    setLoading(true);
    try {
      const response = await UserService.deletePictureUser(userId);
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, pictureURL: null };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, pictureURL: null };
        setUser(updatedUser);
      }
      addNotification("Imagen del usuario eliminada", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al eliminar la imagen del usuario", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editRoleUser = async (userId, roles) => {
    setLoading(true);
    try {
      const response = await UserService.editRoleUser(userId, roles);
      if (userAuth && userAuth.id == userId) {
        const updatedUser = { ...userAuth, roles: roles };
        updatedUserAuth(updatedUser);
      };
      if (user) {
        const updatedUser = { ...user, roles: roles };
        setUser(updatedUser);
      }
      addNotification("Roles del usuario actualizados", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar los roles del usuario", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ loading, users, pagination, user, getUsers, getUser, createUser, updateUser, editEmailUser, editUsernameUser, editPasswordUser, updatePictureUser, deletePictureUser, editRoleUser }}>
      {children}
    </UserContext.Provider>
  );

};

export const useUser = () => useContext(UserContext);
