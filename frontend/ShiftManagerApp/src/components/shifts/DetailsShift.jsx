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
    services.find(s => s.id === id)
  ).filter(Boolean);

  const isTimeComplete = selectedHour !== undefined && selectedMinute !== undefined;

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      <h2 className="text-xl uppercase font-bold text-white tracking-tight border-b border-white/5 pb-4 mb-6">
        Resumen del Turno
      </h2>

            <div className="space-y-4 mb-8">
              {/* Cambiamos el color del icono y el texto según si hay selección */}
              <div className="flex items-start gap-4">
                <span className={`material-symbols-outlined mt-0.5 ${selectedProvider ? 'text-cyan-400' : 'text-zinc-600'}`}>
                  badge
                </span>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Cliente</p>
                  <p className={`text-sm font-bold ${selectedClient ? 'text-white' : 'text-zinc-600'}`}>

                    {selectedClient ? `Cliente: ${selectedClient.firstName + ' ' + selectedClient.lastName }` : "Pendiente de elección"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className={`material-symbols-outlined mt-0.5 ${selectedProvider ? 'text-cyan-400' : 'text-zinc-600'}`}>
                  badge
                </span>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Profesional</p>
                  <p className={`text-sm font-bold ${selectedProvider ? 'text-white' : 'text-zinc-600'}`}>
                    {selectedProvider ? `Profesional ID: ${selectedProvider}` : "Pendiente de elección"}
                  </p>
                </div>
              </div>              

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-cyan-400 mt-0.5">person</span>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Fecha y hora</p>
                  <p className={`text-sm font-bold ${selectedDate && isTimeComplete ? 'text-white' : 'text-zinc-600'}`}>
                    {selectedDate && isTimeComplete 
                      ? `${selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}, ${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} HS`
                      : "Pendiente de selección"}
                  </p>
                </div>
              </div>



            </div>

            <div className="space-y-3 mb-8 border-t border-white/5 pt-6">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">
                Servicios Seleccionados ({selectedServices.length})
              </p>
              
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                {selectedServiceObjects.length > 0 ? (
                  selectedServiceObjects.map((service) => (
                    <div key={service.id} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">{service.name}</span>
                      <span className="text-white font-bold">${service.price.toLocaleString('es-AR')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-600 italic text-center py-2">No hay servicios elegidos</p>
                )}
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-4">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Estimado</p>
                <p className="text-2xl font-bold text-cyan-400 leading-none">
                  ${totalPrice.toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            <button 
              disabled={!selectedProvider || selectedServices.length === 0 || !selectedDate || !isTimeComplete || isSubmitting}
              onClick={onConfirm}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-all active:scale-[0.98] text-sm
                ${selectedProvider && selectedServices.length > 0 && selectedDate && isTimeComplete
                  ? "bg-cyan-400 hover:bg-cyan-500 text-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer" 
                  : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                }`}
            >
              Agendar Turno
            </button>
    </div>
  )
}

export default DetailsShift