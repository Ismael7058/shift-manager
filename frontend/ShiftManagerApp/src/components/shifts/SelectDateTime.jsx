import React, { useState, useEffect } from 'react';
import Calendar from '../ui/Calendar';
import Time from '../ui/Time';

const SelectDateTime = ({
  availableDays = [],
  daysNotAvailable = [],
  minTotalRestrict = 0,
  onDateTimeChange
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedHour, setSelectedHour] = useState(undefined);
  const [selectedMinute, setSelectedMinute] = useState(undefined);

  useEffect(() => {
    setSelectedHour(undefined);
    setSelectedMinute(undefined);

    if (minTotalRestrict <= 0) {
      setSelectedDate(null);
      return;
    }

    if (selectedDate) {
      const availability = getDayAvailability(selectedDate);
      if (availability.isAvailable) {
        const [startH, startM] = availability.startTime.split(':').map(Number);
        const [endH, endM] = availability.endTime.split(':').map(Number);
        const totalShiftMinutes = (endH * 60 + endM) - (startH * 60 + startM);

        // Si la duración de los servicios supera la jornada completa del profesional, la fecha ya no sirve
        if (minTotalRestrict > totalShiftMinutes) {
          setSelectedDate(null);
        }
      } else {
        setSelectedDate(null);
      }
    }
  }, [minTotalRestrict]);

  // 2. Cada que cambia la fecha resetea hora y minuto
  useEffect(() => {
    setSelectedHour(undefined);
    setSelectedMinute(undefined);
  }, [selectedDate]);

  // 3. Cada que cambia la hora resetea el minuto
  useEffect(() => {
    setSelectedMinute(undefined);
  }, [selectedHour]);

  useEffect(() => {
    onDateTimeChange({
      date: selectedDate,
      hour: selectedHour,
      minute: selectedMinute
    });
  }, [selectedDate, selectedHour, selectedMinute, onDateTimeChange]);


  const getDayAvailability = (date) => {
    if (!date || minTotalRestrict <= 0) return { startTime: null, endTime: null, isAvailable: false };

    const dayOfWeek = date.getDay();

    const availability = availableDays.find(
      (day) => day.DayOfWeek === dayOfWeek
    );

    if (!availability) return { startTime: null, endTime: null, isAvailable: false };

    // Dias no disponibles
    const isDayExplicitlyNotAvailable = daysNotAvailable.some(range => {
      const restStart = new Date(range.StartAt);
      const restEnd = new Date(range.EndAt);
      const [hS, mS] = availability.StartTime.split(':').map(Number);
      const [hE, mE] = availability.EndTime.split(':').map(Number);
      const shiftStart = new Date(date).setHours(hS, mS, 0, 0);
      const shiftEnd = new Date(date).setHours(hE, mE, 0, 0);

      return restStart <= shiftStart && restEnd >= shiftEnd;
    });

    if (isDayExplicitlyNotAvailable) {
      return { startTime: null, endTime: null, isAvailable: false };
    }
    
    return {
      startTime: availability.StartTime,
      endTime: availability.EndTime,
      isAvailable: true,
    };
  };

  const currentDayAvailability = getDayAvailability(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        availableDays={availableDays}
        daysNotAvailable={daysNotAvailable}
      />
      <Time
        startTime={currentDayAvailability.startTime}
        sndTime={currentDayAvailability.endTime}
        minTotalRestrict={minTotalRestrict}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        onSelectHour={setSelectedHour}
        onSelectMinute={setSelectedMinute}
        daysNotAvailable={daysNotAvailable}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default SelectDateTime;