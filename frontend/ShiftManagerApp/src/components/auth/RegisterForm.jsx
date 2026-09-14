import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const RegisterForm = ({ isOpen, onClose, onSwitch }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);
    try {
      await register(formData);
      onClose();
    } catch {
      // Notificación de error gestionada por AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Cuenta"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Nombre</label>
            <input
              name="firstName"
              type="text"
              placeholder="Ej. Juan"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Apellido</label>
            <input
              name="lastName"
              type="text"
              placeholder="Ej. Pérez"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Nacimiento</label>
            <input
              name="dateOfBirth"
              type="date"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm shadow-inner"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-white/70 mb-1.5">Género</label>
            <select
              id="gender"
              name="gender"
              required
              defaultValue=""
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            >
              <option value="" disabled className="bg-neutral-900">Seleccionar</option>
              <option value="male" className="bg-neutral-900">Masculino</option>
              <option value="female" className="bg-neutral-900">Femenino</option>
              <option value="other" className="bg-neutral-900">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Teléfono</label>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="+54..."
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Usuario</label>
            <input
              name="username"
              type="text"
              placeholder="juanperez123"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold rounded-lg transition-all px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Crear cuenta'}
        </button>
        <p className="text-white/40 text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4 cursor-pointer">
            Inicia sesión.
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default RegisterForm;