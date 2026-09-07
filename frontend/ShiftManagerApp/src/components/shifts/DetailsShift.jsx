import React from 'react'

const DetailsShift = ({ 
  selectedProvider, 
  selectedServices = [], 
  totalPrice = 0, 
  services = [],
  selectedDate,
  selectedHour,
  selectedMinute,
  selectedClient,
  onConfirm,
  isSubmitting = false
}) => {
  const selectedServiceObjects = selectedServices.map(id => 
    services.find(s => (s.serviceId === id || s.id === id))
  ).filter(Boolean);

  const totalDuration = selectedServiceObjects.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const isTimeComplete = selectedHour !== undefined && selectedMinute !== undefined;

  const providerName = selectedProvider 
    ? (typeof selectedProvider === 'object' 
        ? `${selectedProvider.firstName || ''} ${selectedProvider.lastName || ''}`.trim() || `ID #${selectedProvider.id}`
        : `Profesional #${selectedProvider}`)
    : null;

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-sm sticky top-6">
      <h2 className="text-xl uppercase font-bold text-white tracking-tight border-b border-white/5 pb-4 mb-6 flex items-center justify-between">
        <span>Resumen del Turno</span>
        <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
          Recepción
        </span>
      </h2>

      <div className="space-y-4 mb-6">
        {/* Cliente */}
        <div className="flex items-start gap-3.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${selectedClient ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-neutral-800 text-neutral-500'}`}>
            <span className="material-symbols-outlined text-base">person</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Cliente</p>
            <p className={`text-sm font-semibold truncate ${selectedClient ? 'text-white' : 'text-zinc-600'}`}>
              {selectedClient ? `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim() || selectedClient.email : "Pendiente de selección"}
            </p>
            {selectedClient?.email && (
              <p className="text-[11px] text-neutral-400 truncate">{selectedClient.email}</p>
            )}
          </div>
        </div>

        {/* Profesional */}
        <div className="flex items-start gap-3.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${selectedProvider ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-neutral-800 text-neutral-500'}`}>
            <span className="material-symbols-outlined text-base">badge</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Profesional Asignado</p>
            <p className={`text-sm font-semibold truncate ${providerName ? 'text-white' : 'text-zinc-600'}`}>
              {providerName || "Pendiente de selección"}
            </p>
          </div>
        </div>              

        {/* Fecha y Hora */}
        <div className="flex items-start gap-3.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${selectedDate && isTimeComplete ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-500'}`}>
            <span className="material-symbols-outlined text-base">calendar_clock</span>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Fecha y Horario</p>
            <p className={`text-sm font-semibold ${selectedDate && isTimeComplete ? 'text-white' : 'text-zinc-600'}`}>
              {selectedDate && isTimeComplete 
                ? `${selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}, ${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} hs`
                : "Pendiente de selección"}
            </p>
            {selectedDate && isTimeComplete && totalDuration > 0 && (
              <p className="text-[11px] text-emerald-400/80">
                Duración total: ~{totalDuration} min
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Servicios Seleccionados */}
      <div className="space-y-3 mb-6 border-t border-white/5 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
            Servicios ({selectedServices.length})
          </p>
          {totalDuration > 0 && (
            <span className="text-[10px] text-zinc-400 font-mono">
              ⏱ {totalDuration} min
            </span>
          )}
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {selectedServiceObjects.length > 0 ? (
            selectedServiceObjects.map((service) => (
              <div key={service.serviceId || service.id} className="flex justify-between items-center text-xs bg-neutral-950/40 p-2 rounded-lg border border-white/5">
                <div className="min-w-0 pr-2">
                  <p className="text-zinc-200 font-medium truncate">{service.name}</p>
                  <p className="text-[10px] text-zinc-500">{service.durationMinutes} min</p>
                </div>
                <span className="text-white font-semibold shrink-0">
                  ${(service.price || 0).toLocaleString('es-AR')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-600 italic text-center py-3 bg-neutral-950/20 rounded-lg border border-dashed border-white/5">
              Sin servicios seleccionados
            </p>
          )}
        </div>

        <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-4">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total a Cobrar</p>
            <p className="text-[11px] text-neutral-400">Estimado por servicios</p>
          </div>
          <p className="text-2xl font-black text-cyan-400 leading-none tracking-tight">
            ${totalPrice.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      <button 
        type="button"
        disabled={!selectedClient || !selectedProvider || selectedServices.length === 0 || !selectedDate || !isTimeComplete || isSubmitting}
        onClick={onConfirm}
        className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2
          ${selectedClient && selectedProvider && selectedServices.length > 0 && selectedDate && isTimeComplete && !isSubmitting
            ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 cursor-pointer" 
            : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
          }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creando Turno...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Confirmar y Crear Turno</span>
          </>
        )}
      </button>
    </div>
  )
}

export default DetailsShift