import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShift } from '../context/ShiftsContext';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { useService } from '../context/ServicesContext';
import { useProvider } from '../context/ProviderContext';
import { useClient } from '../context/ClientContext';
import Select2 from '../components/ui/forms/Select2';

const ShiftsPage = () => {
  const { shifts, loading, pagination, getShifts } = useShift();
  const { services, getServices } = useService();
  const { providers, getProviders } = useProvider();
  const { clients, getClients } = useClient();

  const [serviceQuery, setServiceQuery] = useState('');
  const [providerQuery, setProviderQuery] = useState('');
  const [clientQuery, setClientQuery] = useState('');

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

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
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

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
  const handleServiceSelect = (id) => {
    setFilters(prev => ({ ...prev, serviceId: id, pageNumber: 1 }));
  };

  const handleProviderSelect = (id) => {
    setFilters(prev => ({ ...prev, providerId: id, pageNumber: 1 }));
  };

  const handleClientSelect = (id) => {
    setFilters(prev => ({ ...prev, clientId: id, pageNumber: 1 }));
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

  const handleDateFromChange = (e) => {
    setFilters(prev => ({ ...prev, dateFrom: e.target.value, pageNumber: 1 }));
  };

  const handleDateToChange = (e) => {
    setFilters(prev => ({ ...prev, dateTo: e.target.value, pageNumber: 1 }));
  };

  const handleMinPriceChange = (e) => {
    setFilters(prev => ({ ...prev, minPrice: e.target.value, pageNumber: 1 }));
  };

  const handleMaxPriceChange = (e) => {
    setFilters(prev => ({ ...prev, maxPrice: e.target.value, pageNumber: 1 }));
  };

  const handleSortByChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value, pageNumber: 1 }));
  };

  const handleToggleDescending = () => {
    setFilters(prev => ({ ...prev, isDescending: !prev.isDescending, pageNumber: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, pageNumber: newPage }));
  };

  // Columnas para la tabla
  const columns = useMemo(() => [
    {
      key: 'startAt',
      label: 'Inicio',
      render: (shift) => new Date(shift.startAt).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: 'endAt',
      label: 'Fin',
      render: (shift) => new Date(shift.endAt).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
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
        let statusClass = '';
        switch (shift.status?.toLowerCase()) {
          case 'confirmed': statusClass = 'text-green-400'; break;
          case 'pending': statusClass = 'text-yellow-400'; break;
          case 'canceled':
          case 'no_show': statusClass = 'text-red-400'; break;
          case 'completed': statusClass = 'text-blue-400'; break;
          default: statusClass = 'text-white/80';
        }
        return <span className={statusClass}>{shift.status}</span>;
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
              onSelect={handleServiceSelect}
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
              onSelect={handleProviderSelect}
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
              onSelect={handleClientSelect}
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
                onChange={handleDateFromChange}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="px-2.5 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500 transition-colors w-full h-[38px] cursor-pointer [color-scheme:dark]"
                title="Fecha Desde"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={handleDateToChange}
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
                onChange={handleMinPriceChange}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full h-[38px]"
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
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
                onChange={handleSortByChange}
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

      <Modal
        isOpen={modalType === 'shift'}
        onClose={closeModal}
        title='Detalle del Turno'
      >
        {modalData && (
          <div className="text-white space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40">Cliente</p>
                <p>{modalData.clientFullName}</p>
              </div>
              <div>
                <p className="text-white/40">Proveedor</p>
                <p>{modalData.providerFullName}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/40 mb-2">Servicios contratados:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {modalData.items.map((item) => (
                  <li key={item.id}>{item.nameService} - ${item.priceAtMoment}</li>
                ))}
              </ul>
            </div>
            <p className="text-xl font-bold pt-4 text-right">Total: ${modalData.totalAmount}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShiftsPage;