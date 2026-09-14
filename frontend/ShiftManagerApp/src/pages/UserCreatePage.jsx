import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';

const UserCreatePage = () => {
  const navigate = useNavigate();
  const { createUser, loading } = useUser();
  const { roles, getRoles } = useRole();

  useEffect(() => {
    if (getRoles) {
      getRoles();
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    roles: []
  });
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await createUser(
      formData.firstName,
      formData.lastName,
      formData.dateOfBirth,
      formData.gender,
      formData.phoneNumber,
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.roles
    );

    if (response !== undefined) {
      navigate('/usuarios');
    }
  };

  const toggleRoleSelection = (roleId) => {
    setFormData(prev => {
      const current = prev.roles || [];
      const exists = current.includes(roleId);
      const updated = exists
        ? current.filter(id => id !== roleId)
        : [...current, roleId];
      return { ...prev, roles: updated };
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Crear Nuevo Usuario
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Registra una nueva cuenta completando los datos personales, de acceso y roles.
          </p>
        </div>
      </div>

      {/* Formulario Principal con los colores de RegisterForm */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">

        {/* Sección 1: Información Personal */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
            1. Información Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="create-user-firstName" className="block text-sm font-medium text-white/70 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                id="create-user-firstName"
                type="text"
                name="firstName"
                placeholder="Ej. Juan"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="create-user-lastName" className="block text-sm font-medium text-white/70 mb-1.5">
                Apellido <span className="text-red-400">*</span>
              </label>
              <input
                id="create-user-lastName"
                type="text"
                name="lastName"
                placeholder="Ej. Pérez"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="create-user-dateOfBirth" className="block text-sm font-medium text-white/70 mb-1.5">
                Fecha de Nacimiento <span className="text-red-400">*</span>
              </label>
              <input
                id="create-user-dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm shadow-inner"
                required
              />
            </div>

            <div>
              <label htmlFor="create-user-gender" className="block text-sm font-medium text-white/70 mb-1.5">
                Género <span className="text-red-400">*</span>
              </label>
              <select
                id="create-user-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm cursor-pointer"
                required
              >
                <option value="" disabled className="bg-neutral-900">Seleccionar género</option>
                <option value="male" className="bg-neutral-900">Masculino</option>
                <option value="female" className="bg-neutral-900">Femenino</option>
                <option value="other" className="bg-neutral-900">Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="create-user-phoneNumber" className="block text-sm font-medium text-white/70 mb-1.5">
                Número de Teléfono
              </label>
              <input
                id="create-user-phoneNumber"
                type="text"
                name="phoneNumber"
                placeholder="Ej. +54 9 11 1234 5678"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Credenciales de Acceso */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
            2. Credenciales de Acceso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="create-user-email" className="block text-sm font-medium text-white/70 mb-1.5">
                Correo Electrónico <span className="text-red-400">*</span>
              </label>
              <input
                id="create-user-email"
                type="email"
                name="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="create-user-username" className="block text-sm font-medium text-white/70 mb-1.5">
                Nombre de Usuario <span className="text-red-400">*</span>
              </label>
              <input
                id="create-user-username"
                type="text"
                name="username"
                placeholder="juanperez123"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="create-user-password" className="block text-sm font-medium text-white/70 mb-1.5">
                Contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="create-user-password"
                  type={showPassword.password ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-white/10 p-2.5 pr-10 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
                  tabIndex="-1"
                  title={showPassword.password ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword.password ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="create-user-confirmPassword" className="block text-sm font-medium text-white/70 mb-1.5">
                Confirmar Contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="create-user-confirmPassword"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-white/10 p-2.5 pr-10 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
                  required
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
        </div>

        {/* Sección 3: Permisos y Roles */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
            3. Permisos y Roles
          </h2>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Roles Asignados
            </label>
            {roles && roles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isSelected = formData.roles?.includes(Number(role.id));
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
          </div>
        </div>

        {/* Acciones de Guardar / Cancelar */}
        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="px-4 py-2.5 bg-neutral-800/50 hover:bg-neutral-800 text-white border border-white/10 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 font-semibold text-sm rounded-lg transition-all bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreatePage;
