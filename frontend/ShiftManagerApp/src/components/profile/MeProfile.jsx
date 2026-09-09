import { useState, useEffect, useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const BASE_URL = 'http://localhost:5256';

const MeProfile = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { profile, loading, getProfile, updateProfile, editEmail, editUsername, editPassword, updatePicture, deletePicture, changeRoleActive } = useProfile();
  const { addNotification } = useNotification();
  const fileInputRef = useRef(null);


  const [activeAction, setActiveAction] = useState(null);
  const [roleActiveData, setRoleActiveData] = useState('Cliente');
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [usernameData, setUsernameData] = useState('');
  const [emailData, setEmailData] = useState('');
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    phoneNumber: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen) getProfile();
  }, [isOpen]);

  useEffect(() => {
    if (profile) {
      const dob = profile.dateOfBirth?.includes('T') ? profile.dateOfBirth.split('T')[0] : (profile.dateOfBirth || '');
      setPersonalData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || 'male',
        dateOfBirth: dob,
        phoneNumber: profile.phoneNumber || ''
      });
      setEmailData(profile.email || '');
      setUsernameData(profile.username || '');
      setRoleActiveData(user?.roleActive || 'Cliente');
    }
  }, [profile]);

  if (!isOpen) return null;

  const runAction = async (actionKey, actionFn) => {
    setActiveAction(actionKey);
    try {
      await actionFn();
    } catch {
    } finally {
      setActiveAction(null);
    }
  };



  const handleSavePersonal = (e) => {
    e.preventDefault();
    runAction('personal', () => updateProfile(
      personalData.firstName,
      personalData.lastName,
      personalData.dateOfBirth,
      personalData.gender,
      personalData.phoneNumber
    ));
  };

  const handleSaveEmail = (e) => {
    e.preventDefault();
    if (!emailData) return addNotification('Ingresa un correo electrónico válido', 'error');
    runAction('email', () => editEmail(emailData));
  };

  const handleSaveUsername = (e) => {
    e.preventDefault();
    if (!usernameData) return addNotification('Ingresa un nombre de usuario válido', 'error');
    runAction('username', () => editUsername(usernameData));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      return addNotification('Ingresa tu contraseña actual y la nueva contraseña', 'error');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return addNotification('Las nuevas contraseñas no coinciden', 'error');
    }
    runAction('password', async () => {
      await editPassword(passwordData.oldPassword, passwordData.newPassword, passwordData.confirmPassword);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    });
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (changeRoleActive) {
      runAction('role', () => changeRoleActive(roleActiveData));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPicture = () => {
    if (!selectedFile) return;
    runAction('uploadPic', async () => {
      await updatePicture(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    });
  };

  const handleDeletePicture = () => {
    runAction('deletePic', async () => {
      await deletePicture();
      setSelectedFile(null);
      setPreviewUrl(null);
    });
  };

  const displayImage = previewUrl || (profile?.pictureURL ? `${BASE_URL}${profile.pictureURL}` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 overflow-hidden" onClick={onClose}>
      <main className="relative z-50 w-full max-w-[960px] bg-neutral-900 border border-white/10 modal-shadow rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 text-white" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center px-5 h-13 bg-neutral-900 border-b border-white/10 shrink-0">
          <span className="font-bold text-base text-indigo-400">Perfil de Usuario</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => addNotification('Modifica independientemente cada dato de tu perfil', 'info')} className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer" title="Ayuda">
              <span className="material-symbols-outlined text-[18px]">help</span>
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer" title="Cerrar">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>
        <div className="p-5 sm:p-6">
          {loading && !profile ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs">Cargando perfil...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Columna Izquierda */}
              <div className="lg:col-span-6 lg:border-r lg:border-white/10 lg:pr-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[18px]">person</span>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">Datos Personales e Imagen</h2>
                  </div>

                  {/* Foto de Perfil */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()} title="Hacer clic para cambiar foto">
                      {displayImage ? (
                        <img src={displayImage} alt="Foto de perfil" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-md" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-500 shadow-md">
                          {personalData.firstName.charAt(0)}{personalData.lastName.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[18px]">camera_alt</span>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFile ? (
                          <button type="button" onClick={handleUploadPicture} disabled={activeAction === 'uploadPic'} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-[11px] rounded-md transition-colors cursor-pointer">
                            {activeAction === 'uploadPic' ? 'Subiendo...' : '✓ Guardar Imagen'}
                          </button>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-white/10 text-white font-medium text-[11px] rounded-md hover:bg-white/20 transition-colors cursor-pointer">
                            Seleccionar Foto
                          </button>
                        )}

                        {profile?.pictureURL && !selectedFile && (
                          <button type="button" onClick={handleDeletePicture} disabled={activeAction === 'deletePic'} className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white font-medium text-[11px] rounded-md transition-colors cursor-pointer disabled:opacity-50">
                            {activeAction === 'deletePic' ? 'Quitando...' : 'Quitar Imagen'}
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400">JPG, PNG o WebP. Máx 10MB.</p>
                    </div>
                  </div>

                  {/* Datos Personales */}
                  <form onSubmit={handleSavePersonal} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Nombre</label>
                        <input type="text" value={personalData.firstName} onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))} className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Apellido</label>
                        <input type="text" value={personalData.lastName} onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))} className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Género</label>
                        <select value={personalData.gender} onChange={(e) => setPersonalData(prev => ({ ...prev, gender: e.target.value }))} className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none cursor-pointer">
                          <option value="male" className="bg-neutral-900">Masculino</option>
                          <option value="female" className="bg-neutral-900">Femenino</option>
                          <option value="other" className="bg-neutral-900">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-400 mb-1">Fecha Nacimiento</label>
                        <input type="date" value={personalData.dateOfBirth} onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))} className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">Teléfono</label>
                      <input type="tel" value={personalData.phoneNumber} onChange={(e) => setPersonalData(prev => ({ ...prev, phoneNumber: e.target.value }))} className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>

                    <button type="submit" disabled={activeAction === 'personal'} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer">
                      {activeAction === 'personal' ? 'Guardando Datos...' : 'Guardar Datos Personales'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                {/* Email */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[16px]">mail</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Correo Electrónico</h3>
                  </div>
                  <form onSubmit={handleSaveEmail} className="flex gap-2 items-center">
                    <input type="email" value={emailData} onChange={(e) => setEmailData(e.target.value)} placeholder="usuario@ejemplo.com" className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none" />
                    <button type="submit" disabled={activeAction === 'email'} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0">
                      {activeAction === 'email' ? 'Guardando...' : 'Guardar Email'}
                    </button>
                  </form>
                </div>

                {/* Username */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[16px]">alternate_email</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nombre de Usuario</h3>
                  </div>
                  <form onSubmit={handleSaveUsername} className="flex gap-2 items-center">
                    <input type="text" value={usernameData} onChange={(e) => setUsernameData(e.target.value)} placeholder="ej. juanperez" className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white outline-none" />
                    <button type="submit" disabled={activeAction === 'username'} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0">
                      {activeAction === 'username' ? 'Guardando...' : 'Guardar Username'}
                    </button>
                  </form>
                </div>

                {/* Contraseña */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[16px]">lock</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cambiar Contraseña</h3>
                  </div>
                  <form onSubmit={handleSavePassword} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-0.5">Actual</label>
                        <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))} placeholder="••••••••" className="w-full px-2 py-1 bg-black/40 border border-white/10 rounded-md text-xs text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-0.5">Nueva</label>
                        <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="••••••••" className="w-full px-2 py-1 bg-black/40 border border-white/10 rounded-md text-xs text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-0.5">Confirmar</label>
                        <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="••••••••" className="w-full px-2 py-1 bg-black/40 border border-white/10 rounded-md text-xs text-white outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" disabled={activeAction === 'password'} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer">
                        {activeAction === 'password' ? 'Guardando...' : 'Guardar Contraseña'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Rol */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[16px]">badge</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rol Activo</h3>
                  </div>
                  {user?.roles?.length ? (
                    <form onSubmit={handleSaveRole} className="flex gap-2 items-center">
                      <select value={roleActiveData} onChange={(e) => setRoleActiveData(e.target.value)} className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-semibold text-indigo-300 outline-none cursor-pointer">
                        {user?.roles?.map((role, index) => (
                          <option key={index} value={role} className="bg-neutral-900 text-white">{role}</option>
                        ))}
                      </select>
                      <button type="submit" disabled={activeAction === 'role'} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shrink-0 transition-colors cursor-pointer">
                        {activeAction === 'role' ? 'Cambiando...' : 'Guardar Rol'}
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="text-xs text-white"> Sin roles asignados </span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </div>

        <footer className="px-5 py-2.5 flex items-center justify-end border-t border-white/10 bg-neutral-900 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer">
            Cerrar
          </button>
        </footer>
      </main>
    </div>
  );
};

export default MeProfile;