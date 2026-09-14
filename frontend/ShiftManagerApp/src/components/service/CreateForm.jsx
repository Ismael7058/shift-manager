import Modal from '../ui/Modal';
import { useService } from '../../context/ServicesContext';
import { useState } from 'react';

const CreateForm = ({ isOpen, onClose, onSuccess }) => {
  const { createService, loading } = useService();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createService(
      formData.name,
      formData.description,
      formData.durationMinutes
    );

    if (response !== undefined) {
      setFormData({ name: '', description: '', durationMinutes: '' });
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Servicio"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="create-service-name" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Nombre del Servicio
            </label>
            <input
              id="create-service-name"
              type="text"
              name="name"
              placeholder="Ej. Corte de Cabello"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-xs text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="create-service-description" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Descripción
            </label>
            <input
              id="create-service-description"
              type="text"
              name="description"
              placeholder="Descripción breve del servicio..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-xs text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="create-service-duration" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Duración Base (minutos)
            </label>
            <input
              id="create-service-duration"
              type="number"
              name="durationMinutes"
              placeholder="Ej. 30"
              value={formData.durationMinutes}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-xs text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
              min="1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateForm;
