import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useWorkSchedules } from '../../context/WorkSchedulesContext';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ChangeStatusProviderScheduleModal = ({
  isOpen,
  onClose,
  schedule = null,
  onSuccess
}) => {
  const { changeStatusWorkSchedule } = useWorkSchedules();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !schedule) return null;

  const isActive = Boolean(schedule.isActive);
  const actionText = isActive ? 'Desactivar' : 'Activar';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await changeStatusWorkSchedule(schedule.id, !isActive);
      onClose();
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isActive ? 'Desactivar' : 'Activar'} horario`}
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-white">
        <p className="text-sm text-neutral-300 leading-relaxed">
          ¿Estas seguro de que deseas {isActive ? 'Desactivar' : 'Activar'.toLowerCase()} el horario del día{' '}
          <span className="font-semibold text-white">{DAYS[schedule.dayOfWeek]}</span> ({schedule.startTime?.slice(0, 5)} - {schedule.endTime?.slice(0, 5)}) para este proveedor?{' '}
          {isActive
            ? 'Dejara de estar disponible.'
            : 'Volvera a estar disponible.'}
        </p>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer border border-white/10 disabled:opacity-50"
          >
            Cancelar
          </button>
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
            <span>{isActive ? 'Desactivar' : 'Activar'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeStatusProviderScheduleModal;
