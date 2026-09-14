import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useShift } from '../../context/ShiftsContext';

const ChangeStatusShiftModal = ({ isOpen, onClose, shift = null, action = null, statusInfo = null, onSuccess }) => {
  const { changeStatusShift } = useShift();
  const [loading, setLoading] = useState(false);

  if (!shift || !action) return null;


  let title = 'Cambiar Estado';
  let message = '¿Estás seguro de que deseas cambiar el estado de este turno?';
  let btnClass = 'bg-white text-neutral-950 hover:bg-neutral-200';
  let btnText = 'Confirmar';

  if (action === 'confirmed') {
    title = 'Confirmar Turno';
    message = '¿Estás seguro de que deseas confirmar este turno?';
    btnClass = 'bg-emerald-600/80 hover:bg-emerald-600 text-white';
    btnText = 'Confirmar Turno';
  } else if (action === 'completed') {
    title = 'Marcar como Completado';
    message = '¿Confirmas que el servicio fue realizado con éxito y el turno queda completado?';
    btnClass = 'bg-blue-600/80 hover:bg-blue-600 text-white';
    btnText = 'Completar Turno';
  } else if (action === 'canceled') {
    title = 'Cancelar Turno';
    message = '¿Estás seguro de que deseas cancelar este turno? Esta acción no se puede deshacer.';
    btnClass = 'bg-red-600/80 hover:bg-red-600 text-white';
    btnText = 'Sí, Cancelar Turno';
  } else if (action === 'no_show') {
    title = 'Registrar No Asistencia';
    message = '¿Deseas asentar que el cliente no se presentó a su turno agendado?';
    btnClass = 'bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10';
    btnText = 'Registrar No Asistencia';
  }

  const handleConfirmStatusChange = async () => {
    setLoading(true);
    try {
      await changeStatusShift(shift.id, action);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // Notificado en el context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6 text-white">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-white">
              Turno #{shift.id}
            </h4>
            {statusInfo && (
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <span>Estado actual:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}>
                  {statusInfo.label}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-neutral-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmStatusChange}
            disabled={loading}
            className={`px-3.5 py-1.5 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 ${btnClass}`}
          >
            {loading && (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {btnText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusShiftModal;
