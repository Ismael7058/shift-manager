import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal';
import Select2 from '../ui/forms/Select2';
import { useProviderService } from '../../context/ProviderServiceContext';
import { useService } from '../../context/ServicesContext';

const BASE_URL = 'http://localhost:5256';

const CreateProviderServiceModal = ({
  isOpen,
  onClose,
  providerId,
  onSuccess
}) => {
  const { createServiceOfProvider } = useProviderService();
  const { services, getServices, getService } = useService();

  const [formData, setFormData] = useState({
    serviceId: '',
    durationMinutes: '',
    price: ''
  });
  const [selectedBaseService, setSelectedBaseService] = useState(null);
  const [baseServiceQuery, setBaseServiceQuery] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (!isOpen) {
      setFormData({ serviceId: '', durationMinutes: '', price: '' });
      setSelectedBaseService(null);
      setBaseServiceQuery('');
      setLoadingDetails(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && getServices) {
      const timer = setTimeout(() => {
        getServices(baseServiceQuery, '', '', '', '', 1, 'name', false, 1, 50);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, baseServiceQuery]);

  // Opciones para Select2
  const serviceSelectItems = useMemo(() => {
    const list = (services || []).map(s => ({
      id: s.id,
      name: `${s.name} (${s.durationMinutes} min base)`
    }));
    if (selectedBaseService && !list.some(s => s.id === selectedBaseService.id)) {
      list.unshift({
        id: selectedBaseService.id,
        name: `${selectedBaseService.name} (${selectedBaseService.durationMinutes} min base)`
      });
    }
    return list;
  }, [services, selectedBaseService]);

  // Servicio base
  const handleSelectBaseService = async (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId }));
    if (!serviceId) {
      setSelectedBaseService(null);
      return;
    }

    setLoadingDetails(true);
    try {
      if (getService) {
        const detailed = await getService(serviceId);
        setSelectedBaseService(detailed || null);
        if (detailed?.durationMinutes && !formData.durationMinutes) {
          setFormData(prev => ({ ...prev, durationMinutes: detailed.durationMinutes }));
        }
      } else {
        const found = services?.find(s => String(s.id) === String(serviceId));
        setSelectedBaseService(found || null);
      }
    } catch {
      const found = services?.find(s => String(s.id) === String(serviceId));
      setSelectedBaseService(found || null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceId) return;

    setSubmitting(true);
    try {
      const response = await createServiceOfProvider(
        providerId,
        Number(formData.serviceId),
        Number(formData.durationMinutes),
        Number(formData.price)
      );
      if (response) {
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const mainImage = selectedBaseService?.images?.[0]?.imageUrl || null;
  const imageCount = selectedBaseService?.images?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Servicio"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="text-white space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-md">
              {loadingDetails ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-indigo-400">
                  <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                  <span className="text-xs">Cargando servicio...</span>
                </div>
              ) : selectedBaseService ? (
                mainImage ? (
                  <>
                    <img
                      src={mainImage.startsWith('http') ? mainImage : `${BASE_URL}${mainImage}`}
                      alt={selectedBaseService.name}
                      className="w-full h-full object-cover"
                    />
                    {imageCount > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] text-white/90 font-medium border border-white/10">
                        +{imageCount - 1} foto{imageCount > 2 ? 's' : ''}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/30 gap-1.5">
                    <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                    <span className="text-xs">Sin imágenes</span>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 p-4 text-center gap-2">
                  <span className="material-symbols-outlined text-3xl text-white/20">spa</span>
                  <span className="text-xs text-white/40">Selecciona un servicio para ver detalles</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1 min-h-[58px]">
              {selectedBaseService ? (
                <>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {selectedBaseService.description || 'Sin descripción adicional.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>Duración base: {selectedBaseService.durationMinutes} min</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-xs text-white/30 italic">
                    Debes seleccionar un servicio primero
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center space-y-4 md:border-l md:border-white/10 md:pl-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Servicio Base del Catálogo *
              </label>
              <Select2
                items={serviceSelectItems}
                value={formData.serviceId}
                onSelect={handleSelectBaseService}
                onSearch={(query) => setBaseServiceQuery(query)}
                placeholder="Buscar servicio base..."
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Duración para el Proveedor (min) *
                </label>
                {selectedBaseService && (
                  <span className="text-[11px] text-indigo-400 font-medium">
                    Base: {selectedBaseService.durationMinutes}m
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                  placeholder="Ej. 45"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-neutral-600"
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
                  placeholder="Ej. 5000.00"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-neutral-600"
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
            disabled={submitting || !formData.serviceId}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center gap-2"
          >
            {submitting && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>Crear Servicio</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProviderServiceModal;
