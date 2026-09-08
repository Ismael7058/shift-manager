import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClient } from '../context/ClientContext';
import { useProvider } from '../context/ProviderContext';
import { useShift } from '../context/ShiftsContext';
import { useNotification } from '../context/NotificationContext';
import { useWorkSchedules } from '../context/WorkSchedulesContext';
import SelectDateTime from '../components/shifts/SelectDateTime';
import DetailsShift from '../components/shifts/DetailsShift';
import SearchableSelect from '../components/ui/forms/SearchableSelect';
import { useAuth } from '../context/AuthContext';

const ShiftCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const { clients, loading: loadingClients, getClients } = useClient();
  const { providers, providerServices, loading: loadingProviders, getProviders, getServicesOfProvider, getRestrictedDates } = useProvider();
  const { createShift } = useShift();
  const { workSchedules, getAllWorkSchedules } = useWorkSchedules();

  // Opciones seleccionadas
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [providerRestrictedDates, setProviderRestrictedDates] = useState([]);
  const [dateTimeSelection, setDateTimeSelection] = useState({
    date: null,
    hour: undefined,
    minute: undefined
  });

  // Búsqueda
  const [clientSearch, setClientSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Carga inicial
  useEffect(() => {
    if (getClients && user?.roleActive !== 'Cliente') {
      getClients('', 'name', false, 1, 50);
    }
    if (getProviders) {
      getProviders('', 'name', false, false, false, false, 1, 50);
    }
  }, []);


  if (user?.roleActive !== 'Cliente') {
    // Busqueda de clientes
    useEffect(() => {
      if (!getClients) return;
      const timer = setTimeout(() => {
        getClients(clientSearch, 'name', false, 1, 50);
      }, 300);
      return () => clearTimeout(timer);
    }, [clientSearch]);
  }

  // Cargar servicios, horarios y fechas restringidas
  useEffect(() => {
    if (selectedProvider?.id) {
      if (getServicesOfProvider) {
        getServicesOfProvider(selectedProvider.id, '', '', '', '', '', 1, 'name', false, 1, 50);
      }
      if (getAllWorkSchedules) {
        getAllWorkSchedules(selectedProvider.id, '', 1, 'day_of_week', false, 1, 50);
      }
      if (getRestrictedDates) {
        getRestrictedDates(selectedProvider.id).then(dates => {
          setProviderRestrictedDates(dates || []);
        });
      }
    } else {
      setProviderRestrictedDates([]);
    }
  }, [selectedProvider?.id]);



  const handleSelectProvider = (provider) => {
    if (selectedProvider?.id !== provider?.id) {
      setSelectedProvider(provider);
      setSelectedServices([]);
      setDateTimeSelection({ date: null, hour: undefined, minute: undefined });
    }
  };

  const handleToggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  const toggleService = handleToggleService;

  const handleDateTimeChange = useCallback((dateTime) => {
    setDateTimeSelection(dateTime);
  }, []);

  // Crear turno
  const handleCreateShift = async () => {
    if (!selectedClient && user?.roleActive !== 'Cliente') {
      addNotification('Debes seleccionar un cliente.', 'error');
      return;
    }
    if (!selectedProvider) {
      addNotification('Debes seleccionar un profesional.', 'error');
      return;
    }
    if (selectedServices.length === 0) {
      addNotification('Debes seleccionar al menos un servicio.', 'error');
      return;
    }
    if (!dateTimeSelection.date || dateTimeSelection.hour === undefined || dateTimeSelection.minute === undefined) {
      addNotification('Debes seleccionar la fecha y hora de inicio.', 'error');
      return;
    }

    const pad = (num) => String(num).padStart(2, '0');
    const year = dateTimeSelection.date.getFullYear();
    const month = pad(dateTimeSelection.date.getMonth() + 1);
    const day = pad(dateTimeSelection.date.getDate());
    const hours = pad(dateTimeSelection.hour);
    const minutes = pad(dateTimeSelection.minute);
    const startAtLocalString = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;

    const items = selectedServices.map(serviceId => ({ serviceId }));

    setIsSubmitting(true);
    try {
      const res = await createShift(selectedClient ? selectedClient.id : user.id, selectedProvider.id, startAtLocalString, items);
      if (res !== undefined) {
        navigate('/turnos');
      }
    } catch (err) {
      addNotification(err.message || 'Error inesperado al agendar el turno.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };



  // Filtro de clientes
  const filteredClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) return [];
    if (!clientSearch.trim()) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(c =>
      `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q))
    );
  }, [clients, clientSearch]);

  // Filtro de proveedores
  const filteredProviders = useMemo(() => {
    if (!providers || !Array.isArray(providers)) return [];
    if (!providerSearch.trim()) return providers;
    const q = providerSearch.toLowerCase();
    return providers.filter(p =>
      `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase().includes(q)
    );
  }, [providers, providerSearch]);

  // Servicios disponibles
  const availableServices = useMemo(() => {
    if (providerServices && providerServices.length > 0) {
      return providerServices;
    }
    if (selectedProvider?.items && selectedProvider.items.length > 0) {
      return selectedProvider.items;
    }
    return [];
  }, [providerServices, selectedProvider]);

  // Días disponibles
  const formattedAvailableDays = useMemo(() => {
    const schedules = (workSchedules && workSchedules.length > 0)
      ? workSchedules
      : (selectedProvider?.works || []);

    return schedules.map(w => ({
      DayOfWeek: w.dayOfWeek !== undefined ? w.dayOfWeek : w.DayOfWeek,
      StartTime: w.startTime || w.StartTime || '08:00',
      EndTime: w.endTime || w.EndTime || '18:00',
      IsActive: w.isActive !== undefined ? w.isActive : w.IsActive
    }));
  }, [workSchedules, selectedProvider]);

  // Fechas restringidas
  const formattedDaysNotAvailable = useMemo(() => {
    const rawList = Array.isArray(providerRestrictedDates)
      ? providerRestrictedDates
      : (providerRestrictedDates?.items || selectedProvider?.restrictedDates || []);

    return (Array.isArray(rawList) ? rawList : []).map(r => ({
      StartAt: r.startAt || r.StartAt,
      EndAt: r.endAt || r.EndAt
    }));
  }, [providerRestrictedDates, selectedProvider]);

  // Duración total y precio
  const { totalDurationMinutes, totalPrice } = useMemo(() => {
    let duration = 0;
    let price = 0;
    selectedServices.forEach(id => {
      const s = availableServices.find(item => (item.serviceId === id || item.id === id));
      if (s) {
        duration += Number(s.durationMinutes || 0);
        price += Number(s.price || 0);
      }
    });
    return { totalDurationMinutes: duration, totalPrice: price };
  }, [selectedServices, availableServices]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/turnos"
            className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center shadow-lg"
            title="Volver al Listado de Turnos"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Crear Nuevo Turno
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Recepción
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Completa los datos del cliente, profesional, servicios y horario en una sola vista.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Cliente y proveedor */}
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 relative z-20">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
              {user?.roleActive === 'Cliente' ? 'Profesional' : 'Cliente y Profesional'}
            </h2>

            <div className={`grid grid-cols-1 gap-4 ${user?.roleActive !== 'Cliente' ? 'md:grid-cols-2' : ''}`}>
              {user?.roleActive !== 'Cliente' && (
                <SearchableSelect
                  label="Cliente"
                  required
                  placeholder="Buscar por nombre o correo..."
                  selected={selectedClient}
                  items={filteredClients}
                  loading={loadingClients}
                  emptyMessage="No se encontraron clientes"
                  searchValue={clientSearch}
                  onSearchChange={setClientSearch}
                  onSelect={setSelectedClient}
                  onClear={() => setSelectedClient(null)}
                  getLabel={(c) => `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email}
                  getSublabel={(c) => c.email || `@${c.username}`}
                  getAvatarText={(c) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || 'C'}
                  accentColor="cyan"
                />
              )}

              <SearchableSelect
                label="Profesional"
                required
                placeholder="Buscar por nombre o apellido..."
                selected={selectedProvider}
                items={filteredProviders}
                loading={loadingProviders}
                emptyMessage="No se encontraron profesionales"
                searchValue={providerSearch}
                onSearchChange={setProviderSearch}
                onSelect={handleSelectProvider}
                onClear={() => handleSelectProvider(null)}
                getLabel={(p) => `${p.firstName || ''} ${p.lastName || ''}`.trim()}
                getSublabel={(p) => `ID #${p.id} • ${p.items?.length || 0} servicios disp.`}
                getAvatarText={(p) => `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase() || 'P'}
                accentColor="indigo"
              />
            </div>
          </div>

          {/* Servicios */}
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">2</span>
                Servicios del Profesional
              </h2>
              {selectedServices.length > 0 && (
                <span className="text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                  {selectedServices.length} seleccionado(s)
                </span>
              )}
            </div>

            {!selectedProvider ? (
              <div className="py-8 text-center text-neutral-500 bg-neutral-950/20 rounded-xl border border-dashed border-white/5 p-4">
                <span className="material-symbols-outlined text-2xl text-neutral-600 mb-1">badge</span>
                <p className="text-xs">Selecciona un profesional arriba para ver y elegir sus servicios.</p>
              </div>
            ) : availableServices.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 bg-neutral-950/20 rounded-xl border border-dashed border-white/5 p-4">
                <span className="material-symbols-outlined text-2xl text-neutral-600 mb-1">spa</span>
                <p className="text-xs">Este profesional no tiene servicios configurados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {availableServices.map((service) => {
                    const idToCompare = service.serviceId !== undefined ? service.serviceId : service.id;
                    const isChecked = selectedServices.includes(idToCompare);

                    return (
                      <div
                        key={idToCompare}
                        onClick={() => toggleService(idToCompare)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3
                          ${isChecked
                            ? 'bg-purple-500/10 border-purple-500/60 ring-1 ring-purple-500/30'
                            : 'bg-neutral-950/50 border-white/5 hover:border-white/15'
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                            ${isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-neutral-700 bg-neutral-900'}`}>
                            {isChecked && <span className="material-symbols-outlined text-xs">check</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{service.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">⏱ {service.durationMinutes} min</p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-cyan-400 shrink-0">
                          ${(service.price || 0).toLocaleString('es-AR')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="flex items-center justify-between pt-2 text-xs border-t border-white/5 text-neutral-400">
                    <span>Duración acumulada: <strong className="text-white">{totalDurationMinutes} min</strong></span>
                    <span>Subtotal: <strong className="text-cyan-400">${totalPrice.toLocaleString('es-AR')}</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                Fecha y Horario de Inicio
              </h2>
              {dateTimeSelection.date && dateTimeSelection.hour !== undefined && dateTimeSelection.minute !== undefined && (
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  {String(dateTimeSelection.hour).padStart(2, '0')}:{String(dateTimeSelection.minute).padStart(2, '0')} hs
                </span>
              )}
            </div>

            {selectedServices.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 bg-neutral-950/20 rounded-xl border border-dashed border-white/5 p-4">
                <span className="material-symbols-outlined text-2xl text-neutral-600 mb-1">calendar_month</span>
                <p className="text-xs">Selecciona al menos un servicio arriba para ver los días y horarios disponibles.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <SelectDateTime
                  availableDays={formattedAvailableDays}
                  daysNotAvailable={formattedDaysNotAvailable}
                  minTotalRestrict={totalDurationMinutes}
                  onDateTimeChange={handleDateTimeChange}
                />
              </div>
            )}
          </div>

        </div>

        {/*Flotante del Turno */}
        <div className="lg:col-span-5 xl:col-span-4">
          <DetailsShift
            selectedClient={user?.roleActive === 'Cliente' ? user : selectedClient}
            selectedProvider={selectedProvider}
            selectedServices={selectedServices}
            services={availableServices}
            totalPrice={totalPrice}
            selectedDate={dateTimeSelection.date}
            selectedHour={dateTimeSelection.hour}
            selectedMinute={dateTimeSelection.minute}
            onConfirm={handleCreateShift}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ShiftCreatePage;
