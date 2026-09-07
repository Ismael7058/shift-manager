import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useProviderService } from '../../context/ProviderServiceContext';
import { useService } from '../../context/ServicesContext';

const BASE_URL = 'http://localhost:5256';

const EditProviderServiceModal = ({
  isOpen,
  onClose,
  providerId,
  service = null,
  onSuccess
}) => {
  const { updateServiceOfProvider } = useProviderService();
  const { getService } = useService();

  const [formData, setFormData] = useState({ durationMinutes: '', price: '' });
  const [serviceDetails, setServiceDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !service) return;

    setFormData({
      durationMinutes: service.durationMinutes,
      price: service.price
    });

    if (getService && service.serviceId) {
      getService(service.serviceId)
        .then(res => setServiceDetails(res))
        .catch(() => setServiceDetails(null));
    }
  }, [isOpen, service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    try {
      await updateServiceOfProvider(
        service.serviceId,
        providerId,
        Number(formData.durationMinutes),
        Number(formData.price)
      );
      onClose();
      if (onSuccess) onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

  const mainImage = serviceDetails?.images?.[0]?.imageUrl || null;
  const imageCount = serviceDetails?.images?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar: ${service.name}`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="text-white space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-md">
              {mainImage ? (
                <img
                  src={mainImage.startsWith('http') ? mainImage : `${BASE_URL}${mainImage}`}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 gap-1.5">
                  <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}

              {imageCount > 1 && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] text-white/90 font-medium border border-white/10">
                  +{imageCount - 1} foto{imageCount > 2 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {service.description && (
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <span className="material-symbols-outlined text-base">schedule</span>
                <span>Duración base del catálogo: {service.durationMinutesBase} min</span>
              </div>
            </div>
          </div>


          <div className="md:col-span-7 flex flex-col justify-center space-y-4 md:border-l md:border-white/10 md:pl-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Duración del Proveedor (min) *
                </label>
                <span className="text-[11px] text-indigo-400 font-medium">
                  Base: {service.durationMinutesBase}m
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40">
                  min
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Precio Asignado ($) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
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

export default EditProviderServiceModal;
