import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5256';
const DAYS_NAME = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const DetailProviderModal = ({ isOpen, onClose, provider, schedules = [], loadingSchedules = false, accessToActions = false }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [provider]);

  if (!isOpen || !provider) return null;

  const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || 'Proveedor';
  const imgUrl = provider.pictureURL;
  const pictureSrc = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${BASE_URL}${imgUrl}`) : null;
  const initials = `${provider.firstName?.charAt(0) || ''}${provider.lastName?.charAt(0) || ''}`.toUpperCase();

  const handleNavigateToServices = () => {
    onClose();
    navigate(`/proveedores/${provider.id}/servicios`, {
      state: { providerId: provider.id, providerName: fullName }
    });
  };

  const handleNavigateToSchedules = () => {
    onClose();
    navigate(`/proveedores/${provider.id}/horarios`, {
      state: { providerId: provider.id, providerName: fullName }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-md h-[560px] flex flex-col justify-between bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">

        {/* Encabezado: Foto de Perfil y Datos */}
        <div>
          <h2 className="text-xl font-bold text-white text-center mb-3">
            Detalle del Proveedor
          </h2>

          <div className="flex flex-col items-center text-center pb-3 border-b border-neutral-800/80">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-neutral-300 font-bold text-base shadow-md">
              {pictureSrc && !imgError ? (
                <img
                  src={pictureSrc}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-xs font-bold">{initials}</span>
              )}
            </div>

            <p className="text-base font-semibold text-white">
              {fullName}
            </p>
            {provider.id && (
              <p className="text-xs text-neutral-400 font-mono">
                Código : #{provider.id}
              </p>
            )}
          </div>
        </div>

        {/* Sección Central de Horarios */}
        <div className="flex-1 flex flex-col min-h-0 my-3">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Horarios de Trabajo
          </h4>

          {loadingSchedules ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-xs">
              <span className="animate-pulse">Cargando horarios...</span>
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center rounded-xl bg-neutral-900/40 border border-neutral-800/40">
              <p className="text-xs text-neutral-400 font-medium">Sin horarios registrados</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">El proveedor no tiene jornadas laborales asignadas.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {schedules
                .slice()
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((schedule) => (
                  <div
                    key={schedule.id || schedule.dayOfWeek}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-neutral-200">
                        {DAYS_NAME[schedule.dayOfWeek] || `Día ${schedule.dayOfWeek}`}
                      </span>
                    </div>

                    <div className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/40">
                      {schedule.startTime?.substring(0, 5)} - {schedule.endTime?.substring(0, 5)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between gap-2">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          {accessToActions && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNavigateToServices}
                className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Gestionar Servicios de este proveedor"
              >
                <span>Servicios</span>
              </button>

              <button
                type="button"
                onClick={handleNavigateToSchedules}
                className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Gestionar Horarios de este proveedor"
              >
                <span>Horarios</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailProviderModal;
