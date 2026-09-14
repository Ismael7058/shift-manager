import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useWorkSchedules } from '../../context/WorkSchedulesContext';
import { useNotification } from '../../context/NotificationContext';

const EditProviderScheduleModal = ({
  isOpen,
  onClose,
  schedule = null,
  onSuccess
}) => {
  const { updateWorkSchedule } = useWorkSchedules();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '18:00'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !schedule) return;

    setFormData({
      dayOfWeek: schedule.dayOfWeek ?? 1,
      startTime: schedule.startTime ? schedule.startTime.slice(0, 5) : '09:00',
      endTime: schedule.endTime ? schedule.endTime.slice(0, 5) : '18:00'
    });
    setSubmitting(false);
  }, [isOpen, schedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schedule) return;

    if (formData.startTime >= formData.endTime) {
      addNotification('La hora de inicio debe ser anterior a la hora de fin.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await updateWorkSchedule(
        schedule.id,
        Number(formData.dayOfWeek),
        formData.startTime,
        formData.endTime
      );

      if (onSuccess) onSuccess();

    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !schedule) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Horario"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="text-white space-y-5">
        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1.5">
            Día de la Semana *
          </label>
          <select
            value={formData.dayOfWeek}
            onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
            className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={1} className="bg-neutral-900 text-white">Lunes</option>
            <option value={2} className="bg-neutral-900 text-white">Martes</option>
            <option value={3} className="bg-neutral-900 text-white">Miércoles</option>
            <option value={4} className="bg-neutral-900 text-white">Jueves</option>
            <option value={5} className="bg-neutral-900 text-white">Viernes</option>
            <option value={6} className="bg-neutral-900 text-white">Sábado</option>
            <option value={0} className="bg-neutral-900 text-white">Domingo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Hora Inicio *
            </label>
            <input
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Hora Fin *
            </label>
            <input
              type="time"
              required
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer border border-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
          >
            {submitting && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProviderScheduleModal;
