import Modal from '../ui/Modal';
import { useService } from '../../context/ServicesContext';

const ChangeStatusModal = ({ isOpen, onClose, service = null, onSuccess }) => {
  const { changeStatusService, loading } = useService();

  if (!service) return null;

  const nextStatus = !service.isActive;

  const handleConfirmStatusChange = async () => {
    try {
      const response = await changeStatusService(service.id, nextStatus);
      if (response !== undefined) {
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Estado del Servicio"
    >
      <div className="space-y-4 text-white">
        <div className="p-4 bg-neutral-800/80 border border-neutral-700 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Servicio seleccionado
              </span>
              <h4 className="text-base font-bold text-white">
                {service.name}
              </h4>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <span className="text-xs text-neutral-400">Estado actual:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${service.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {service.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {service.durationMinutes && (
            <div className="pt-2.5 border-t border-neutral-700/60 flex items-center justify-between text-xs text-neutral-400">
              <span>Duración base:</span>
              <span className="font-semibold text-neutral-200">{service.durationMinutes} min</span>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed px-1">
          ¿Estás seguro de que deseas cambiar el estado de este servicio a{' '}
          <strong className={nextStatus ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {nextStatus ? 'Activo' : 'Inactivo'}
          </strong>?
        </p>

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
            {loading ? 'Procesando...' : nextStatus ? 'Activar Servicio' : 'Desactivar Servicio'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusModal;
