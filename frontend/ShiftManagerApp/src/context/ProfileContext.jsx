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
        updateUser(response);
      };
      
      return response;
    } catch (error) {
      addNotification(error.message || "Error al cargar perfil", 'error');
    }
    finally{
      setLoading(false);
    };
  };

  const updateProfile = async (firstName, lastName, dateOfBirth, gender, phoneNumber) => {
    setLoading(true);
    try {
      const response = await ProfileService.updateMe({ firstName, lastName, dateOfBirth, gender, phoneNumber });
      setProfile(response.usuario);
      if (updateUser) {
        updateUser(response.usuario);
      }
      addNotification(response.message || "Perfil actualizado con éxito", 'success');
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
      const response = await ProfileService.editEmail({email});
      if(user){
        const updatedUser = { ...user, Email: email };
        updateUser(updatedUser);
      }
      addNotification(response.message || "Email cambiado con éxito", 'success');
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
      const response = await ProfileService.editUsername({username});
      if(user){
        const updatedUser = { ...user, Username: username };
        updateUser(updatedUser);
      }

      addNotification(response.message || "Username cambiado con éxito", 'success');
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
      addNotification(response.message || "Contraseña cambiada con éxito", 'success');
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
      if(user){
        const updatedUser = { ...user, PictureURL: response };
        updateUser(updatedUser);
      }
      addNotification(response.message || "Imagen de perfil actualizada", 'success');
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
      if(user){
        const updatedUser = { ...user, PictureURL: null };
        updateUser(updatedUser);
      }

      addNotification(response.message || "Imagen de perfil eliminada", 'success');
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
    <ProfileContext.Provider value={profile, loading, getProfile, updateProfile, editEmail, editUsername, editPassword, updatePicture, deletePicture, changeRoleActive}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext); 
