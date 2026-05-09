import React, { useState, useEffect, useMemo } from 'react';
import SelectDateTime from '../components/shifts/SelectDateTime';
import SupplierCarousel from '../components/provider/SupplierCarousel';
import ListService from '../components/service/ListService';
import DetailsShift from '../components/shifts/DetailsShift';
import { useAuth } from '../context/AuthContext';
import { useMyShifts } from '../context/MyShiftsContext'
import { useProvider } from '../context/ProviderContext'
import { useNotification } from '../context/NotificationContext'

const CreateShiftPage = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(undefined);
  const [selectedMinute, setSelectedMinute] = useState(undefined);
  const { addNotification } = useNotification();

  const { providers: allProviders, loading: providersLoading, fetchProviders } = useProvider();
  const { createShift, loading: isCreatingShift } = useMyShifts();
  const { user } = useAuth();

  // Obtiene los datos completos del profesional seleccionado
  const selectedProviderObject = useMemo(() => {
    return allProviders.find(p => p.id === selectedProvider);
  }, [allProviders, selectedProvider]);

  // Formatea los días y horarios laborales del profesional
  const availableDays = useMemo(() => {
    return selectedProviderObject?.works
      ?.filter(w => w.isActive)
      .map(w => ({
        DayOfWeek: w.dayOfWeek,
        StartTime: w.startTime,
        EndTime: w.endTime
      })) || [];
  }, [selectedProviderObject]);

  // Obtiene los rangos de fechas en los que el profesional no está disponible
  const daysNotAvailable = useMemo(() => {
    return selectedProviderObject?.restrictedDates
      ?.map(rd => ({
        StartAt: rd.startAt,
        EndAt: rd.endAt
      })) || [];
  }, [selectedProviderObject]);

  // Carga inicial de los proveedores registrados
  useEffect(() => {
    fetchProviders({ IncludeServices: true, IncludeWorkSchedules: true, IncludeRestrictedDates: true });
  }, [fetchProviders]);

  // Filtra los servicios ofrecidos por el profesional elegido
  const availableServices = useMemo(() => {
    return selectedProviderObject?.items || [];
  }, [selectedProviderObject]);

  // Duracion total sumando cada servicio seleccionado
  const totalDuration = selectedServices.reduce((acc, serviceId) => {
    const service = availableServices.find(s => s.serviceId === serviceId);
    return acc + (service ? service.durationMinutes : 0);
  }, 0);

  // Calcula el costo total de los servicios seleccionados
  const totalPrice = selectedServices.reduce((acc, serviceId) => {
    const service = availableServices.find(s => s.serviceId === serviceId);
    return acc + (service ? service.price : 0);
  }, 0);

  // Actualiza el profesional seleccionado y limpia servicios previos
  const handleSelectProvider = (id) => {
    setSelectedProvider(id);
    setSelectedServices([]);
  };

  // Agrega o quita un servicio de la lista de seleccion
  const handleSelectService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(sId => sId !== id)
        : [...prev, id]
    );
  };

  // Crear turno, consultar nuevamente los proveedores y reiniciar el formulario
  const handleConfirmShift = async () => {
    if (!selectedProvider || selectedServices.length === 0 || !selectedDate || selectedHour === undefined || selectedMinute === undefined) {
      addNotification('Faltan selecciones para confirmar el turno', 'error')
      return;
    }

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(selectedHour, selectedMinute, 0, 0);
    const startAtISOString = startDateTime.toISOString();

    const shiftData = {
      providerId: selectedProvider,
      startAt: startAtISOString,
      items: selectedServices.map(id => ({ serviceId: id }))
    };

    await createShift(shiftData);

    fetchProviders({ IncludeServices: true, IncludeWorkSchedules: true, IncludeRestrictedDates: true });

    setSelectedProvider(null);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedHour(undefined);
    setSelectedMinute(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
        Agendar un turno
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-neutral-900/50 border border-white/10 rounded-xl p-4 transition-all">
          <section className="p-4 custom-scrollbar">
            <h2 className="text-2xl uppercase font-bold text-white mb-8 tracking-tight">
              1. Elegir profesional
            </h2>
            {providersLoading && (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
            )}
            <SupplierCarousel
              data={allProviders}
              selectedId={selectedProvider}
              onSelect={handleSelectProvider}
            />
          </section>

          <section className={`p-4 duration-500 ${!selectedProvider && 'opacity-30'}`}>
            <div className='flex justify-between items-center mb-8 '>
              <h2 className="text-2xl uppercase font-bold text-white tracking-tight">
                2. Selecciona servicios
              </h2>
              <span className='text-xs text-white/60 font-bold uppercase'>Servicios Seleccionados {selectedServices.length}</span>
            </div>

            {!selectedProvider && (
              <p className="text-zinc-500 text-sm italic">Selecciona un profesional arriba para ver sus servicios disponibles...</p>
            )}
            {selectedProvider && (

              <ListService
                data={availableServices.map(s => ({
                  ...s,
                  id: s.serviceId
                }))}
                selectedIds={selectedServices}
                onSelect={handleSelectService}
              />

            )}
          </section>

          <section className={`p-4 duration-500 ${(!selectedProvider || selectedServices.length === 0) ? 'opacity-30 pointer-events-none' : ''}`}>
            <h2 className="text-2xl uppercase font-bold text-white mb-8 tracking-tight">
              3. Fecha y hora
            </h2>

            {selectedProvider && selectedServices.length === 0 && (
              <p className="text-zinc-500 text-sm italic mb-6">
                Selecciona al menos un servicio arriba para habilitar la elección de fecha y hora.
              </p>
            )}

            <SelectDateTime
              availableDays={availableDays}
              daysNotAvailable={daysNotAvailable}
              minTotalRestrict={totalDuration}
              onDateTimeChange={(selection) => {
                setSelectedDate(selection.date);
                setSelectedHour(selection.hour);
                setSelectedMinute(selection.minute);
              }}
            />

          </section>
        </div>

        <aside className="md:col-span-1 md:self-start md:sticky md:top-8 space-y-6">
          <DetailsShift
            selectedProvider={selectedProvider}
            selectedServices={selectedServices}
            totalPrice={totalPrice}
            services={availableServices.map(s => ({
              ...s,
              id: s.serviceId
            }))}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            onConfirm={handleConfirmShift}
            isSubmitting={isCreatingShift}
            selectedClient={user}
          />
        </aside>
      </div>
    </div>
  )
}

export default CreateShiftPage