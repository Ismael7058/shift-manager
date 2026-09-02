import Modal from '../ui/Modal';
import { useUser } from '../../context/UserContext';

const ChangeStatusUserModal = ({ isOpen, onClose, user = null, onSuccess }) => {
  const { changeStatusUser, loading } = useUser();

  if (!user) return null;

  const nextStatus = !user.isActive;

  const handleConfirmStatusChange = async () => {
    try {
      const response = await changeStatusUser(user.id, nextStatus);
      if (response !== undefined) {
        if (onSuccess) onSuccess();
      }
    } catch {
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={nextStatus ? 'Activar Usuario' : 'Desactivar Usuario'}
    >
      <div className="space-y-6 text-white">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-white">
              {user.firstName} {user.lastName}
            </h4>
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
              <span>Estado actual:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
            ¿Estás seguro de cambiar el estado del usuario a{' '}
            <strong className={nextStatus ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {nextStatus ? 'Activo' : 'Inactivo'}
            </strong>?
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-neutral-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmStatusChange}
            className={`px-3.5 py-1.5 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${nextStatus
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
          >
            {loading ? 'Cargando...' : nextStatus ? 'Activar Usuario' : 'Desactivar Usuario'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusUserModal;
