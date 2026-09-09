import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useProviderService } from '../../context/ProviderServiceContext';

const ChangeStatusProviderServiceModal = ({
  isOpen,
  onClose,
  providerId,
  service = null,
  onSuccess
}) => {
  const { softDeleteServiceOfProvider, activeServiceOfProvider } = useProviderService();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !service) return null;

  const isActive = service.status === 1;
  const isBaseInactive = service.status === 2;
  const actionText = isActive ? 'Desactivar' : 'Activar';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (isActive) {
        await softDeleteServiceOfProvider(service.serviceId, providerId);
      } else {
        await activeServiceOfProvider(service.serviceId, providerId);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionText} servicio`}
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-white">
        {isBaseInactive ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            El Servicio esta inactivo no se puede modificar su estado.
          </div>
        ) : (
          <p className="text-sm text-neutral-300 leading-relaxed">
            ¿Estás seguro de que deseas {actionText.toLowerCase()} el servicio{' '}
            <span className="font-semibold text-white">"{service.name}"</span>?{' '}
            {isActive
              ? 'Dejará de estar disponible para agendar nuevos turnos.'
              : 'Volverá a estar habilitado para la reserva de turnos.'}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer border border-white/10 disabled:opacity-50"
          >
            Cancelar
          </button>
          {!isBaseInactive && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${isActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
            >
              {loading && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{actionText}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusProviderServiceModal;
