import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useService } from '../context/ServicesContext';
import { useNotification } from '../context/NotificationContext';
import ChangeStatusModal from '../components/service/ChangeStatusModal';

const BASE_URL = 'http://localhost:5256';
const MAX_IMAGES = 7;

const ServiceUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, getService, updateService, uploadServiceImages, deleteServiceImage, loading } = useService();
  const { addNotification } = useNotification();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: ''
  });
  const [images, setImages] = useState([]);
  const [serviceStatus, setServiceStatus] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  // servicio
  useEffect(() => {
    if (id) {
      getService(id);
    }
  }, [id]);


  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        durationMinutes: service.durationMinutes || ''
      });
      setImages(service.images || []);
      setServiceStatus(service.isActive);
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    await updateService(
      id,
      formData.name,
      formData.description,
      Number(formData.durationMinutes)
    );
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      addNotification(`El límite máximo es de ${MAX_IMAGES} imágenes por servicio. Intentaste subir ${images.length + files.length} en total.`, 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const addedImages = await uploadServiceImages(id, files);
      if (addedImages && Array.isArray(addedImages)) {
        setImages(prev => [...prev, ...addedImages]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    const success = await deleteServiceImage(id, imageId);
    if (success) {
      setImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-neutral-400 gap-3">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-medium">Cargando detalles del servicio...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/servicios"
            className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
            title="Volver a Servicios"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {formData.name || 'Servicio'}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                #{id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${serviceStatus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {serviceStatus ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Modifica los detalles y gestiona la galería multimedia</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-stretch">

        <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 shadow-xl">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Información General
          </h2>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label htmlFor="service-name" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Nombre del Servicio
              </label>
              <input
                id="service-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="service-duration" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Duración Base (minutos)
              </label>
              <input
                id="service-duration"
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                min="1"
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="service-desc" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Descripción
              </label>
              <textarea
                id="service-desc"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Detalla qué incluye el servicio..."
              />
            </div>

            <div className="pt-2 flex justify-end">

              <button
                type="button"
                onClick={() => {
                  setModalData(service);
                  setModalType('status');
                }}
                className={`px-4 py-2 font-semibold text-xs rounded-lg transition-colors cursor-pointer mr-2 ${serviceStatus
                  ? 'bg-amber-600/80 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
                  }`}
              >
                {serviceStatus ? 'Desactivar' : 'Activar'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imágenes de Referencia
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">Formatos .jpg, .png, .webp (máx. 10MB c/u, límite {MAX_IMAGES} imágenes)</p>
            </div>

            <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
              {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
            </span>
          </div>

          {/* Subir imagenes */}
          {images.length < MAX_IMAGES ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 hover:border-indigo-500/60 bg-neutral-950/40 hover:bg-neutral-900/40 rounded-xl p-4 text-center cursor-pointer transition-colors mb-5 flex flex-col items-center justify-center gap-1.5"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleUploadImages}
                className="hidden"
              />
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <p className="text-xs font-medium text-neutral-300">
                {uploading ? 'Subiendo imágenes...' : 'Haz clic para seleccionar o arrastra imágenes aquí'}
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-red-900/50 bg-red-950/20 rounded-xl p-4 text-center mb-5 flex flex-col items-center justify-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-red-400">
                Límite máximo de {MAX_IMAGES} imágenes alcanzado. Elimina alguna para subir nuevas.
              </p>
            </div>
          )}

          {/* Imagenes */}
          {images.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl bg-neutral-950/20 border border-neutral-800/40">
              <p className="text-xs text-neutral-400 font-medium">Sin imágenes registradas</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Sube fotografías del servicio para que los clientes tengan referencias visuales.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {images.map((img) => {
                const src = img.imageUrl.startsWith('http') ? img.imageUrl : `${BASE_URL}${img.imageUrl}`;
                return (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-square shadow-md"
                  >
                    <img
                      src={src}
                      alt="Referencia de servicio"
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Boton eliminar */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
                        title="Eliminar imagen"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Estado */}
      <ChangeStatusModal
        isOpen={modalType === 'status'}
        service={modalData}
        onClose={closeModal}
        onSuccess={() => setServiceStatus(!serviceStatus)}
      />
    </div>
  );
};

export default ServiceUpdatePage;
