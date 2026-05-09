import React, { useState } from 'react';

const Calendar = ({ selectedDate, onSelectDate, availableDays = [], daysNotAvailable = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonthName = (date) => {
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  };

  const generateDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysFromPrevMonth = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    // dias del mes anterior
    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }

    // dias del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // dias del mes siguiente para rellenar el final
    const totalCells = 42;
    const daysFromNextMonth = totalCells - days.length;
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = generateDays(currentMonth);

  const isDaySelectable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return false;

    const dayOfWeek = date.getDay();

    const schedule = availableDays.find(d => d.DayOfWeek === dayOfWeek);
    if (!schedule) return false;

    // Bloquear el dia solo si la restriccion cubre el dia laboral
    const isRestricted = daysNotAvailable.some(range => {
      const restStart = new Date(range.StartAt);
      const restEnd = new Date(range.EndAt);
      const [hS, mS] = schedule.StartTime.split(':').map(Number);
      const [hE, mE] = schedule.EndTime.split(':').map(Number);
      
      const shiftStart = new Date(date).setHours(hS, mS, 0, 0);
      const shiftEnd = new Date(date).setHours(hE, mE, 0, 0);

      return restStart <= shiftStart && restEnd >= shiftEnd;
    });
    if (isRestricted) return false;

    return true;
  };

  return (
    <div className="w-full">
      <div className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-white uppercase tracking-widest text-sm">{getMonthName(currentMonth)}</span>
          <div className="flex gap-4">
            <span onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="material-symbols-outlined text-xl cursor-pointer hover:text-yellow-400 text-white/50 transition-colors">chevron_left</span>
            <span onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="material-symbols-outlined text-xl cursor-pointer hover:text-yellow-400 text-white/50 transition-colors">chevron_right</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-zinc-500 mb-4 uppercase font-bold tracking-tighter">
          <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {days.map((day, index) => {
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
            const selectable = isDaySelectable(day.date) && day.isCurrentMonth;

            return (
              <div
                key={index}
                onClick={() => selectable && onSelectDate(day.date)}
                className={`p-2 rounded-sm cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'text-white' : 'text-zinc-800'}
                  ${isToday && !isSelected ? 'border border-yellow-400' : ''}
                  ${isSelected ? 'bg-yellow-400 text-black font-bold' : ''}
                  ${!selectable ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}
                `}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;