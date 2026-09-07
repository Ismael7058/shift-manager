import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProviderService } from '../context/ProviderServiceContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import CreateProviderServiceModal from '../components/provider/CreateProviderServiceModal';
import EditProviderServiceModal from '../components/provider/EditProviderServiceModal';
import ChangeStatusProviderServiceModal from '../components/provider/ChangeStatusProviderServiceModal';

const ProviderServicesPage = () => {
  const { id: providerId } = useParams();
  const {
    providerServices,
    loading,
    pagination,
    getServicesOfProvider
  } = useProviderService();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);


  const [filters, setFilters] = useState({
    name: '',
    isActive: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });


  const refreshList = () => {
    if (!providerId) return;
    getServicesOfProvider(
      providerId,
      '',
      filters.name,
      '',
      '',
      filters.minPrice,
      filters.maxPrice,
      filters.isActive,
      filters.sortBy,
      filters.isDescending,
      filters.pageNumber,
      filters.pageSize
    );
  };

  useEffect(() => {
    refreshList();
  }, [providerId, filters]);

  // Handlers
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, name: e.target.value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (e) => {
    setFilters(prev => ({ ...prev, isActive: e.target.value, pageNumber: 1 }));
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

  // Apertura de modales
  const openAssignModal = () => {
    setIsCreateOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setIsEditOpen(true);
  };

  const openStatusModal = (service) => {
    setSelectedService(service);
    setIsStatusOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsStatusOpen(false);
    setSelectedService(null);
  };

  // Columnas de la tabla
  const columns = useMemo(() => [
    {
      key: 'serviceId',
      label: 'Código',
      render: (service) => `#${service.serviceId}`
    },
    {
      key: 'name',
      label: 'Servicio',
      render: (service) => (
        <div>
          <p className="font-semibold text-white text-sm">{service.name}</p>
          {service.description && (
            <p className="text-xs text-white/50 truncate max-w-xs">{service.description}</p>
          )}
        </div>
      )
    },
    {
      key: 'durationMinutes',
      label: 'Duración',
      render: (service) => (
        <div className="text-xs">
          <span className="font-medium text-white">{service.durationMinutes} min</span>
          {service.durationMinutesBase && service.durationMinutesBase !== service.durationMinutes && (
            <span className="text-white/40 ml-1.5">(Base: {service.durationMinutesBase}m)</span>
          )}
        </div>
      )
    },
    {
      key: 'price',
      label: 'Precio',
      render: (service) => (
        <span className="font-bold text-emerald-400">
          ${Number(service.price || 0).toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (service) => {
        if (service.status === 1) {
          return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Activo
            </span>
          );
        }
        if (service.status === 0) {
          return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              Inactivo
            </span>
          );
        }
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30" title="El servicio general está suspendido en el sistema">
            Base Inactivo
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (service) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(service)}
            className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Editar
          </button>
          {service.status !== 2 && (
            <button
              type="button"
              onClick={() => openStatusModal(service)}
              className={`px-3 py-1 font-semibold text-xs rounded-lg transition-colors cursor-pointer ${service.status === 1
                ? 'bg-amber-600/80 hover:bg-amber-600 text-white'
                : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
                }`}
            >
              {service.status === 1 ? 'Desactivar' : 'Activar'}
            </button>
          )}
        </div>
      )
    }
  ], [providerId]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/proveedores"
              className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>← Volver a Proveedores</span>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Servicios del Proveedor #{providerId}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona las tarifas, duraciones personalizadas y disponibilidad de servicios de este proveedor.
          </p>
        </div>

        <button
          type="button"
          onClick={openAssignModal}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Crear Servicio</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Buscar por nombre
            </label>
            <input
              type="text"
              placeholder="Nombre del servicio..."
              value={filters.name}
              onChange={handleSearchChange}
              className="px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Estado
            </label>
            <select
              value={filters.isActive}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="" className="bg-neutral-900">Todos</option>
              <option value="true" className="bg-neutral-900">Activos</option>
              <option value="false" className="bg-neutral-900">Inactivos</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Ordenar por
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={handleSortByChange}
                className="px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm flex-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="name" className="bg-neutral-900">Nombre</option>
                <option value="price" className="bg-neutral-900">Precio</option>
                <option value="durationMinutes" className="bg-neutral-900">Duración</option>
              </select>
              <button
                type="button"
                onClick={handleToggleDescending}
                className="px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
                title={filters.isDescending ? "Descendente" : "Ascendente"}
              >
                {filters.isDescending ? '↓' : '↑'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setFilters({
                  name: '',
                  isActive: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'name',
                  isDescending: false,
                  pageNumber: 1,
                  pageSize: 10
                });
              }}
              className="w-full px-3.5 py-2 border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50 space-x-2">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm">Cargando servicios del proveedor...</span>
        </div>
      ) : providerServices.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-neutral-900/50">
          <span className="material-symbols-outlined text-5xl text-neutral-500 mb-2">spa</span>
          <h3 className="text-lg font-semibold text-white">No se encontraron servicios</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Este proveedor aún no tiene servicios asignados o no coinciden con la búsqueda.
          </p>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={providerServices}
            className="rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm"
          />
          {pagination && (
            <div className="mt-4">
              <Pagination
                totalCount={pagination.totalCount}
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Crear */}
      <CreateProviderServiceModal
        isOpen={isCreateOpen}
        onClose={closeModals}
        providerId={providerId}
        onSuccess={refreshList}
      />

      {/* Editar */}
      <EditProviderServiceModal
        isOpen={isEditOpen}
        onClose={closeModals}
        providerId={providerId}
        service={selectedService}
        onSuccess={refreshList}
      />

      {/* Estado*/}
      <ChangeStatusProviderServiceModal
        isOpen={isStatusOpen}
        onClose={closeModals}
        providerId={providerId}
        service={selectedService}
        onSuccess={refreshList}
      />
    </div>
  );
};

export default ProviderServicesPage;
