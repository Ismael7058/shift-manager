import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import { useAuth } from '../../context/AuthContext'

const LoginForm = ({ isOpen, onClose, onSwitch, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!credentials.identifier || !credentials.password) {
      return 'Todos los campos son obligatorios';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loginUser(credentials);
      onLoginSuccess();
      onClose();
      navigate('/docs');
    } catch (err) {
      setError(err.message);
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
        <p className='text-white/85'>
          Inicie sesión en su cuenta de
          <span className='font-semibold'> ShiftManager</span>
        </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Username o Email</label>
          <input
            type="text"
            name="identifier"
            placeholder="nombre@ejemplo.com"
            onChange={handleChange}
            className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none" />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold rounded-lg transition-all px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98]">
          {loading ? 'Cargando...' : 'Login'}
        </button>
        <p className='text-white/40 text-center text-sm'>
          ¿No tienes una cuenta? <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4">Registrate aquí.</button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginForm;