import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import { useNotification } from '../context/NotificationContext';
import ChangeStatusUserModal from '../components/users/ChangeStatusUserModal';

const BASE_URL = 'http://localhost:5256';

const UsersDetailPage = () => {
  const { id } = useParams();
  const { roles, getRoles } = useRole();
  const { user, loading, getUser, updateUser, editEmailUser, editUsernameUser, editPasswordUser, updatePictureUser, deletePictureUser, editRoleUser } = useUser();
  const { addNotification } = useNotification();
  const fileInputRef = useRef(null);

  const [modalType, setModalType] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    phoneNumber: ''
  });
  const [emailData, setEmailData] = useState('');
  const [usernameData, setUsernameData] = useState('');
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ newPassword: false, confirmPassword: false });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rolesData, setRolesData] = useState({ rolesId: [] });

  useEffect(() => {
    if (id) {
      getUser(id);
    }
  }, [id]);

  useEffect(() => {
    if (getRoles) {
      getRoles();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const dob = user.dateOfBirth?.includes('T') ? user.dateOfBirth.split('T')[0] : (user.dateOfBirth || '');
      setPersonalData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        gender: user.gender || 'male',
        dateOfBirth: dob,
        phoneNumber: user.phoneNumber || ''
      });
      setEmailData(user.email || '');
      setUsernameData(user.username || '');

      if (user.roles && Array.isArray(user.roles)) {
        const userRoleIds = user.roles.map(r => {
          if (typeof r === 'object' && r !== null) {
            return Number(r.id !== undefined ? r.id : r.value);
          }
          if (!isNaN(Number(r))) {
            return Number(r);
          }
          if (roles && Array.isArray(roles)) {
            const matchedRole = roles.find(item => item.name?.toLowerCase() === String(r).toLowerCase());
            if (matchedRole) return Number(matchedRole.id);
          }
          return r;
        }).filter(n => typeof n === 'number' && !isNaN(n));

        setRolesData({ rolesId: userRoleIds });
      }
    }
  }, [user, roles]);

  const runAction = async (actionKey, actionFn) => {
    setActiveAction(actionKey);
    try {
      await actionFn();
      await getUser(id);
    } catch {
    } finally {
      setActiveAction(null);
    }
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    runAction('personal', () => updateUser(
      id,
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
    runAction('email', () => editEmailUser(id, emailData));
  };

  const handleSaveUsername = (e) => {
    e.preventDefault();
    if (!usernameData) return addNotification('Ingresa un nombre de usuario válido', 'error');
    runAction('username', () => editUsernameUser(id, usernameData));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      return addNotification('Ingresa la nueva contraseña y su confirmación', 'error');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return addNotification('Las contraseñas no coinciden', 'error');
    }
    runAction('password', async () => {
      await editPasswordUser(id, passwordData.newPassword, passwordData.confirmPassword);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    });
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
      await updatePictureUser(id, selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    });
  };

  const handleDeletePicture = () => {
    runAction('deletePic', async () => {
      await deletePictureUser(id);
      setSelectedFile(null);
      setPreviewUrl(null);
    });
  };

  const toggleRoleSelection = (roleId) => {
    setRolesData(prev => {
      const current = prev.rolesId || [];
      const exists = current.includes(roleId);
      const updated = exists
        ? current.filter(id => id !== roleId)
        : [...current, roleId];
      return { ...prev, rolesId: updated };
    });
  };

  const handleSaveRoles = (e) => {
    e.preventDefault();
    const numericRoles = (rolesData.rolesId || []).map(v => Number(v)).filter(n => !isNaN(n));
    runAction('roles', () => editRoleUser(id, numericRoles));
  };

  const closeModal = () => {
    setModalType(null);
  };
  const displayImage = previewUrl || (user?.pictureURL ? `${BASE_URL}${user.pictureURL}` : null);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/usuarios"
              className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>← Volver a Usuarios</span>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Detalles del Usuario
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Administra la información personal, imagen de perfil, credenciales y permisos.
          </p>
        </div>
      </div>

      {loading && !user ? (
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm">Cargando detalles del usuario...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Columna Izquierda */}
          <div className="lg:col-span-6 bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl text-white flex flex-col">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2 mb-4">
              1. Información Personal e Imagen
            </h2>

            {/* Foto de Perfil */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-800/30 border border-white/10 rounded-lg">
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()} title="Hacer clic para cambiar foto">
                {displayImage ? (
                  <img src={displayImage} alt="Foto de usuario" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-xl border border-white/10 shadow-md">
                    {personalData.firstName?.charAt(0)}{personalData.lastName?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">camera_alt</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {selectedFile ? (
                    <button type="button" onClick={handleUploadPicture} disabled={activeAction === 'uploadPic'} className="px-3.5 py-1.5 bg-white text-neutral-950 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50">
                      {activeAction === 'uploadPic' ? 'Subiendo...' : '✓ Guardar Imagen'}
                    </button>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3.5 py-1.5 bg-neutral-800/50 hover:bg-neutral-800 text-white border border-white/10 font-semibold text-xs rounded-lg transition-colors cursor-pointer">
                      Seleccionar Foto
                    </button>
                  )}

                  {user?.pictureURL && !selectedFile && (
                    <button type="button" onClick={handleDeletePicture} disabled={activeAction === 'deletePic'} className="px-3.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                      {activeAction === 'deletePic' ? 'Quitando...' : 'Quitar Imagen'}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-white/40">Soporta JPG, PNG o WebP (máx. 10MB).</p>
              </div>
            </div>

            {/* Formulario Datos Personales */}
            <form onSubmit={handleSavePersonal} className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Nombre</label>
                    <input
                      type="text"
                      value={personalData.firstName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Apellido</label>
                    <input
                      type="text"
                      value={personalData.lastName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Género</label>
                    <select
                      value={personalData.gender}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm cursor-pointer"
                      required
                    >
                      <option value="male" className="bg-neutral-900">Masculino</option>
                      <option value="female" className="bg-neutral-900">Femenino</option>
                      <option value="other" className="bg-neutral-900">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha Nacimiento</label>
                    <input
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Número de Teléfono</label>
                  <input
                    type="tel"
                    value={personalData.phoneNumber}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-6 mt-auto flex items-center justify-between gap-3">
                <button type='button'
                  onClick={() => {
                    setModalType('status');
                  }}
                  className={`w-full py-2.5 ${user?.isActive ? 'bg-red-600/80 hover:bg-red-600' : 'bg-emerald-600/80 hover:bg-emerald-600'} text-white font-semibold text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]`}>
                  {user?.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
                </button>
                <button
                  type="submit"
                  disabled={activeAction === 'personal'}
                  className="w-full py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                >
                  {activeAction === 'personal' ? 'Guardando Datos...' : 'Guardar Datos Personales'}
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            {/* Email */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
                2. Correo Electrónico
              </h2>
              <form onSubmit={handleSaveEmail} className="flex gap-3 items-center">
                <input
                  type="email"
                  value={emailData}
                  onChange={(e) => setEmailData(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="flex-1 bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={activeAction === 'email'}
                  className="px-4 py-2.5 bg-white text-neutral-950 font-semibold text-sm rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] shrink-0"
                >
                  {activeAction === 'email' ? 'Guardando...' : 'Guardar Email'}
                </button>
              </form>
            </div>

            {/* Username */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
                3. Nombre de Usuario
              </h2>
              <form onSubmit={handleSaveUsername} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={usernameData}
                  onChange={(e) => setUsernameData(e.target.value)}
                  placeholder="juanperez123"
                  className="flex-1 bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={activeAction === 'username'}
                  className="px-4 py-2.5 bg-white text-neutral-950 font-semibold text-sm rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] shrink-0"
                >
                  {activeAction === 'username' ? 'Guardando...' : 'Guardar Username'}
                </button>
              </form>
            </div>

            {/* Cambiar Contraseña */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 shadow-2xl space-y-3">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
                4. Cambiar Contraseña
              </h2>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword.newPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-neutral-800/50 border border-white/10 p-2.5 pr-10 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
                        tabIndex="-1"
                        title={showPassword.newPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword.newPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-neutral-800/50 border border-white/10 p-2.5 pr-10 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
                        tabIndex="-1"
                        title={showPassword.confirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword.confirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={activeAction === 'password'}
                    className="px-5 py-2.5 bg-white text-neutral-950 font-semibold text-sm rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    {activeAction === 'password' ? 'Guardando...' : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            </div>

            {/* Roles */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Gestión de Roles
                  </h2>
                </div>
                <span className="text-xs bg-white/5 text-white/70 px-2.5 py-1 rounded-full border border-white/10 font-medium">
                  Seleccionados: <span className="text-indigo-400 font-bold">{rolesData.rolesId?.length || 0}</span>/{roles?.length || 0}
                </span>
              </div>

              <form onSubmit={handleSaveRoles} className="space-y-5">
                {roles && roles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roles.map((role) => {
                      const isSelected = rolesData.rolesId?.includes(Number(role.id));
                      return (
                        <div
                          key={role.id}
                          onClick={() => toggleRoleSelection(Number(role.id))}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none active:scale-[0.99] ${isSelected
                            ? 'bg-indigo-950/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'border border-white/30'
                                }`}
                            >
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-white text-sm">
                            {role.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic">Cargando roles disponibles...</p>
                )}

                <div className="flex justify-end pt-2 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={activeAction === 'roles'}
                    className="px-5 py-2.5 bg-white text-neutral-950 font-semibold text-sm rounded-lg hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    {activeAction === 'roles' ? 'Guardando...' : 'Guardar Roles'}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      )}

      <ChangeStatusUserModal
        isOpen={modalType === 'status'}
        user={user}
        onClose={closeModal}
        onSuccess={() => getUser(user.id)}
      />
    </div>
  );
};

export default UsersDetailPage;
