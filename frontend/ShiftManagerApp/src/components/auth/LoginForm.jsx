import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ isOpen, onClose, onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);
    try {
      await login(credentials);
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
      title="Iniciar Sesión"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-white/85">
          Inicie sesión en su cuenta de
          <span className="font-semibold"> ShiftManager</span>
        </p>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Username o Email</label>
          <input
            type="text"
            name="identifier"
            placeholder="nombre@ejemplo.com"
            required
            className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold rounded-lg transition-all px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        <p className="text-white/40 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4 cursor-pointer">
            Registrate aquí.
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginForm;