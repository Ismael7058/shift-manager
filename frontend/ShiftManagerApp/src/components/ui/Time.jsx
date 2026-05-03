import React from 'react';

const Time = ({ 
  startTime,
  sndTime,
  minTotalRestrict = 0, 
  selectedHour, 
  selectedMinute, 
  onSelectHour, 
  onSelectMinute,
  daysNotAvailable = [],
  selectedDate
}) => {
  
  // Auxiliar para convertir "HH:mm" a minutos totales transcurridos en el día
  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  if (!startTime || !sndTime) {
    return <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-lg w-full text-center text-zinc-500 text-sm">Selecciona una fecha disponible para ver los horarios.</div>;
  };

  const startTotal = toMinutes(startTime);
  const endTotal = toMinutes(sndTime);
  
  const startH = Math.floor(startTotal / 60);
  const endH = Math.floor(endTotal / 60);

  // Generamos el rango de horas según la jornada del profesional
  const hours = Array.from({ length: Math.max(0, endH - startH + 1) }, (_, i) => startH + i);
  const minutesIntervals = Array.from({ length: 60 }, (_, i) => i);

  // Verificar si el turno cabe en la agenda
  const isTimeValid = (h, m) => {
    if (!selectedDate) return false;

    const currentMinutes = h * 60 + m;
    
    if (currentMinutes < startTotal || (currentMinutes + minTotalRestrict) > endTotal) return false;

    // Validar rangos restringidos
    const slotStart = new Date(selectedDate).setHours(h, m, 0, 0);
    const slotEnd = new Date(selectedDate).setHours(h, m + minTotalRestrict, 0, 0);

    const isRestricted = daysNotAvailable.some(range => {
      const restStart = new Date(range.StartAt).getTime();
      const restEnd = new Date(range.EndAt).getTime();
      return slotStart < restEnd && slotEnd > restStart;
    });

    return !isRestricted;
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-lg h-full w-full">
      <div className="grid grid-cols-2 gap-4 h-72">
        {/* Columna de Horas */}
        <div className="flex flex-col h-full min-h-0">
          <span className="text-[10px] text-zinc-500 uppercase font-bold mb-3 text-center tracking-widest">Hora</span>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1 snap-y snap-mandatory">
            {hours.map((h) => {
              const isSelected = h === selectedHour;
              const isHourPossible = minutesIntervals.some(m => isTimeValid(h, m));
              
              return (
                <button
                  key={h}
                  disabled={!isHourPossible}
                  onClick={() => onSelectHour(h)}
                  className={`w-full border py-4 text-xs font-bold tracking-widest transition-all snap-center shrink-0 rounded-md
                    ${isSelected
                      ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" // Estilo para hora seleccionada
                      : "bg-white/5 border-white/10 text-white hover:border-white/30 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed"
                    }`}
                >
                  {h.toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna de Minutos */}
        <div className="flex flex-col h-full min-h-0">
          <span className="text-[10px] text-zinc-500 uppercase font-bold mb-3 text-center tracking-widest">Minutos</span>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1 snap-y snap-mandatory">
            {minutesIntervals.map((m) => {
              const isSelected = m === selectedMinute;
              const isValid = selectedHour !== undefined ? isTimeValid(selectedHour, m) : false;
              
              return (
                <button
                  key={m}
                  disabled={!isValid}
                  onClick={() => onSelectMinute(m)}
                  className={`w-full border py-4 text-xs font-bold tracking-widest transition-all snap-center shrink-0 rounded-md
                    ${isSelected
                      ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" // Estilo para minuto seleccionado
                      : "bg-white/5 border-white/10 text-white hover:border-white/30 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed"
                    }`}
                >
                  {m.toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Time;
