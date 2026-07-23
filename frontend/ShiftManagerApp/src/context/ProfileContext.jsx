import { createContext, useContext, useState, useEffect, useCallback, Children } from 'react';
import { ProfileService } from '../services/profileService'
import { handleApiError } from '../utils/apiErrorHandler';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await ProfileService.getMe();
      setProfile(response);
      if (updateUser) {
        const updatedUser = {
          ...user,
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          dateOfBirth: response.dateOfBirth,
          gender: response.gender,
          phoneNumber: response.phoneNumber,
          username: response.username,
          email: response.email,
          pictureURL: response.pictureURL
        };

        updateUser(updatedUser);
      };

      return response;
    } catch (error) {
      addNotification(error.message || "Error al cargar perfil", 'error');
    }
    finally {
      setLoading(false);
    };
  };

  const updateProfile = async (firstName, lastName, dateOfBirth, gender, phoneNumber) => {
    setLoading(true);
    try {
      const response = await ProfileService.updateMe({ firstName, lastName, dateOfBirth, gender, phoneNumber });
      if (user) {
        const updatedUser = { ...user, firstName, lastName, dateOfBirth, gender, phoneNumber };
        updateUser(updatedUser);
      }
      if (profile) {
        const updatedProfile = { ...profile, firstName, lastName, dateOfBirth, gender, phoneNumber };
        setProfile(updatedProfile);
      }
      addNotification("Perfil actualizado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al actualizar perfil", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editEmail = async (email) => {
    setLoading(true);
    try {
      const response = await ProfileService.editEmail({ email });
      if (user) {
        const updatedUser = { ...user, email: email };
        updateUser(updatedUser);
      }
      if (profile) {
        const updatedProfile = { ...profile, email: email };
        setProfile(updatedProfile);
      }
      addNotification("Email cambiado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar el email", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editUsername = async (username) => {
    setLoading(true);
    try {
      const response = await ProfileService.editUsername({ username });
      if (user) {
        const updatedUser = { ...user, username: username };
        updateUser(updatedUser);
      }
      if (profile) {
        const updatedProfile = { ...profile, username: username };
        setProfile(updatedProfile);
      }
      addNotification("Username cambiado con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar el username", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editPassword = async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      const response = await ProfileService.editPassword({ oldPassword, newPassword, confirmPassword });
      addNotification("Contraseña cambiada con éxito", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar contraseña", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePicture = async (file) => {
    setLoading(true);
    try {
      const response = await ProfileService.updatePicture(file);
      if (user) {
        const updatedUser = { ...user, pictureURL: response.pictureURL };
        updateUser(updatedUser);
      }
      if (profile) {
        const updatedProfile = { ...profile, pictureURL: response.pictureURL };
        setProfile(updatedProfile);
      }
      addNotification("Imagen de perfil actualizada", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar la imagen de perfil", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePicture = async () => {
    setLoading(true);
    try {
      const response = await ProfileService.deletePicture();
      if (user) {
        const updatedUser = { ...user, pictureURL: null };
        updateUser(updatedUser);
      }

      if (profile) {
        const updatedProfile = { ...profile, pictureURL: null };
        setProfile(updatedProfile);
      }

      addNotification("Imagen de perfil eliminada", 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al eliminar la imagen de perfil", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeRoleActive = async (role) => {
    setLoading(true);
    try {
      const response = await ProfileService.changeRoleActive(role);
      addNotification(response.message || `Cambio al rol: ${role}`, 'success');
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cambiar de rol", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, getProfile, updateProfile, editEmail, editUsername, editPassword, updatePicture, deletePicture, changeRoleActive }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext); 
