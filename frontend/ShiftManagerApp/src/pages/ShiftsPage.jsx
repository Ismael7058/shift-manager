import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShift } from '../context/ShiftsContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { useService } from '../context/ServicesContext';
import { useProvider } from '../context/ProviderContext';
import { useClient } from '../context/ClientContext';
import Select2 from '../components/ui/forms/Select2';
import { parseDateToLocal } from '../utils/dateUtils';

const getTodayLocal = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ShiftsPage = () => {
  const { shifts, loading, pagination, getShifts } = useShift();
  const { services, getServices } = useService();
  const { providers, getProviders } = useProvider();
  const { clients, getClients } = useClient();

  const [serviceQuery, setServiceQuery] = useState('');
  const [providerQuery, setProviderQuery] = useState('');
  const [clientQuery, setClientQuery] = useState('');

  const [filters, setFilters] = useState({
    serviceId: '',
    providerId: '',
    clientId: '',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    sortBy: 'startAt',
    isDescending: true,
    pageNumber: 1,
    pageSize: 10
  });

  // Shifts
  useEffect(() => {
    const handler = setTimeout(() => {
      if (getShifts) {
        getShifts(
          filters.providerId,
          filters.clientId,
          filters.serviceId,
          filters.dateFrom,
          filters.dateTo,
          filters.minPrice,
          filters.maxPrice,
          filters.status,
          '',
          '',
          filters.sortBy,
          filters.isDescending,
          filters.pageNumber,
          filters.pageSize
        );
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  // Services
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (getServices) {
        getServices(serviceQuery, '', '', '', '', 1, 'name', false, 1, 10);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [serviceQuery]);

  // Providers
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (getProviders) {
        getProviders(providerQuery, 'name', false, false, false, false, 1, 10);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [providerQuery]);

  // Clients
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (getClients) {
        getClients(clientQuery, 'name', false, 1, 10);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [clientQuery]);

  // Opciones formateadas para Select2
  const serviceItems = useMemo(() => {
    return (services || []).map(s => ({
      id: s.id,
      name: s.name
    }));
  }, [services]);

  const providerItems = useMemo(() => {
    return (providers || []).map(p => ({
      id: p.id,
      name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || `Proveedor #${p.id}`
    }));
  }, [providers]);

  const clientItems = useMemo(() => {
    return (clients || []).map(c => ({
      id: c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.username || c.email || `Cliente #${c.id}`
    }));
  }, [clients]);


  // Handlers para filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleStatusToggle = (statusKey) => {
    setFilters(prev => {
      const currentStatuses = Array.isArray(prev.status) ? prev.status : [];
      const newStatuses = currentStatuses.includes(statusKey)
        ? currentStatuses.filter(s => s !== statusKey)
        : [...currentStatuses, statusKey];
      return { ...prev, status: newStatuses, pageNumber: 1 };
    });
  };

  const handleToggleDescending = () => {
    setFilters(prev => ({ ...prev, isDescending: !prev.isDescending, pageNumber: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, pageNumber: newPage }));
  };

  const handleTabChange = (tabId) => {
    const today = getTodayLocal();
    if (tabId === 'today') {
      setFilters(prev => ({
        ...prev,
        dateFrom: today,
        dateTo: today,
        status: ['confirmed'],
        pageNumber: 1
      }));
    } else if (tabId === 'pending') {
      setFilters(prev => ({
        ...prev,
        dateFrom: '',
        dateTo: '',
        status: ['pending'],
        pageNumber: 1
      }));
    } else if (tabId === 'all') {
      setFilters(prev => ({
        ...prev,
        dateFrom: '',
        dateTo: '',
        status: '',
        pageNumber: 1
      }));
    }
  };

  const todayStr = getTodayLocal();
  const isTodayConfirmed =
    filters.dateFrom === todayStr &&
    filters.dateTo === todayStr &&
    Array.isArray(filters.status) &&
    filters.status.length === 1 &&
    filters.status[0] === 'confirmed';

  const isPendingOnly =
    !filters.dateFrom &&
    !filters.dateTo &&
    Array.isArray(filters.status) &&
    filters.status.length === 1 &&
    filters.status[0] === 'pending';

  const isAll =
    !filters.dateFrom &&
    !filters.dateTo &&
    (!filters.status || filters.status.length === 0);

  // Columnas para la tabla
  const columns = useMemo(() => [
    {
      key: 'date',
      label: 'Fecha',
      render: (shift) => {
        const start = parseDateToLocal(shift.startAt);
        if (!start) return '-';
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`;
      }
    },
    {
      key: 'time',
      label: 'Horario',
      render: (shift) => {
        const start = parseDateToLocal(shift.startAt);
        const end = parseDateToLocal(shift.endAt);
        if (!start) return '-';
        const pad = (n) => String(n).padStart(2, '0');
        const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
        const endTime = end ? `${pad(end.getHours())}:${pad(end.getMinutes())}` : '--:--';
        return `${startTime} a ${endTime}`;
      }
    },
    {
      key: 'providerFullName',
      label: 'Proveedor',
    },
    {
      key: 'items',
      label: 'Servicios',
      render: (shift) => shift.items.map(s => s.nameService).join(', ')
    },
    {
      key: 'status',
      label: 'Estado',
      render: (shift) => {
        let text = '';
        let statusClass = '';
        switch (shift.status?.toLowerCase()) {
          case 'confirmed': text = "Confirmado"; statusClass = 'text-green-400'; break;
          case 'pending': text = "Pendiente"; statusClass = 'text-yellow-400'; break;
          case 'canceled': text = "Cancelado"; statusClass = 'text-red-400'; break;
          case 'no_show': text = "No Asistió"; statusClass = 'text-red-400'; break;
          case 'completed': text = "Completado"; statusClass = 'text-blue-400'; break;
          default: text = shift.status; statusClass = 'text-white/80';
        }
        return <span className={statusClass}>{text}</span>;
      }
    },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (shift) => `$${shift.totalAmount.toFixed(2)}`
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (shift) =>
        <Link
          to={`/turnos/${shift.id}`}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Ver
        </Link>
    }
  ], []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestión de Turnos
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Catálogo de turnos disponibles</p>
        </div>

        <Link
          to="/turnos/nuevo"
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          + Crear Turno
        </Link>
      </div>

      {/* Vistas Rápidas (Tabs) */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleTabChange('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-[0.98] ${
            isAll
              ? 'bg-neutral-800 text-white border-white/20 shadow-md'
              : 'bg-neutral-900/50 text-white/60 border-white/10 hover:text-white hover:border-white/20'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">list_alt</span>
          <span>Todos los turnos</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('today')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-[0.98] ${
            isTodayConfirmed
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-md font-bold'
              : 'bg-neutral-900/50 text-white/60 border-white/10 hover:text-emerald-400 hover:border-emerald-500/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">today</span>
          <span>Agenda de Hoy (Confirmados)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('pending')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-[0.98] ${
            isPendingOnly
              ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/40 shadow-md font-bold'
              : 'bg-neutral-900/50 text-white/60 border-white/10 hover:text-yellow-400 hover:border-yellow-500/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">pending_actions</span>
          <span>Por Confirmar</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all space-y-4">
        {/* Fila 1: Búsquedas con Select2 (3 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Servicio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Servicio
            </label>
            <Select2
              items={serviceItems}
              value={filters.serviceId}
              onSelect={(id) => updateFilter('serviceId', id)}
              onSearch={(query) => setServiceQuery(query)}
              placeholder="Buscar servicio..."
              valueKey="id"
              labelKey="name"
            />
          </div>

          {/* Proveedor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Proveedor
            </label>
            <Select2
              items={providerItems}
              value={filters.providerId}
              onSelect={(id) => updateFilter('providerId', id)}
              onSearch={(query) => setProviderQuery(query)}
              placeholder="Buscar proveedor..."
              valueKey="id"
              labelKey="name"
            />
          </div>

          {/* Cliente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Cliente
            </label>
            <Select2
              items={clientItems}
              value={filters.clientId}
              onSelect={(id) => updateFilter('clientId', id)}
              onSearch={(query) => setClientQuery(query)}
              placeholder="Buscar cliente..."
              valueKey="id"
              labelKey="name"
            />
          </div>
        </div>

        {/* Fila 2: Fechas, Precios y Ordenamiento (3 columnas balanceadas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Rango de Fechas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Rango de Fechas
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="px-2.5 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500 transition-colors w-full h-[38px] cursor-pointer [color-scheme:dark]"
                title="Fecha Desde"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="px-2.5 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500 transition-colors w-full h-[38px] cursor-pointer [color-scheme:dark]"
                title="Fecha Hasta"
              />
            </div>
          </div>

          {/* Rango de Precios */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Precio ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full h-[38px]"
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full h-[38px]"
              />
            </div>
          </div>

          {/* Ordenar por y Dirección */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none cursor-pointer focus:border-indigo-500 transition-colors w-full h-[38px]"
              >
                <option value="startAt" className="bg-neutral-900">Fecha</option>
                <option value="totalAmount" className="bg-neutral-900">Precio</option>
                <option value="status" className="bg-neutral-900">Estado</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleToggleDescending}
              className="h-[38px] px-3.5 bg-black border border-white/10 hover:bg-white/10 rounded-lg text-xs text-white transition-colors cursor-pointer flex items-center justify-center shrink-0 font-medium"
              title={filters.isDescending ? "Orden Descendente" : "Orden Ascendente"}
            >
              <span>{filters.isDescending ? "↓ Desc" : "↑ Asc"}</span>
            </button>
          </div>
        </div>

        {/* Fila 3: Filtro de Estados en barra horizontal dedicada */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-1">
              Estados {filters.status.length > 0 && `(${filters.status.length})`}:
            </span>
            {[
              { id: 'pending', label: 'Pendiente', activeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
              { id: 'confirmed', label: 'Confirmado', activeColor: 'bg-green-500/20 text-green-300 border-green-500/50' },
              { id: 'completed', label: 'Completado', activeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
              { id: 'canceled', label: 'Cancelado', activeColor: 'bg-red-500/20 text-red-300 border-red-500/50' },
              { id: 'no_show', label: 'No Asistió', activeColor: 'bg-neutral-600/40 text-neutral-300 border-neutral-500/50' },
            ].map((item) => {
              const isSelected = filters.status?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleStatusToggle(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                    ? `${item.activeColor} shadow-sm font-semibold`
                    : 'bg-black border-white/10 text-white/50 hover:text-white hover:border-white/30'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {filters.status.length > 0 && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, status: '', pageNumber: 1 }))}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕ Limpiar estados
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-white/50 my-8 italic">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
          Cargando turnos...
        </div>
      ) : (
        <Table columns={columns} data={shifts} />
      )}

      {pagination && (
        <div className='mt-4'>
          <Pagination
            totalCount={pagination.totalCount}
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            searchTerm={filters.searchTerm}
          />
        </div>
      )}
    </div>
  );
};

export default ShiftsPage;