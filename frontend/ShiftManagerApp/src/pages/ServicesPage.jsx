import React, { useEffect, useState, useMemo } from 'react';
import { useService } from '../context/ServicesContext';
import Table from '../components/ui/Table';
import CreateForm from '../components/service/CreateForm';
import ChangeStatusModal from '../components/service/ChangeStatusModal';
import Pagination from '../components/ui/Pagination';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:5256';
const ServicesPage = () => {
  const { services, loading, pagination, getServices } = useService();
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    minDurationMinutes: '',
    maxDurationMinutes: '',
    minPrice: '',
    maxPrice: '',
    isActive: '',
    sortBy: '',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  const refreshList = () => {
    getServices(
      filters.name,
      filters.minDurationMinutes,
      filters.maxDurationMinutes,
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
  }, [filters.name, filters.isActive, filters.sortBy, filters.isDescending, filters.pageNumber, filters.pageSize]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, name: e.target.value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      isActive: value,
      pageNumber: 1
    }));
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

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  // Columnas de la tabla de Servicios
  const columns = useMemo(() => [
    { key: 'id', label: 'Código', className: 'w-1 whitespace-nowrap' },
    {
      key: 'image',
      label: 'Imagen',
      className: 'w-1 whitespace-nowrap',
      render: (service) => {
        const firstImg = service.images && service.images.length > 0 ? service.images[0].imageUrl : null;
        const fullImgSrc = firstImg ? (firstImg.startsWith('http') ? firstImg : `${BASE_URL}${firstImg}`) : null;
        if (fullImgSrc) {
          return (
            <img
              src={fullImgSrc}
              alt={service.name}
              className="w-8 h-8 rounded-lg object-cover border border-white/20 shadow-sm"
            />
          );
        }
        return (
          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-xs border border-white/10">
            -
          </div>
        );
      }
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (service) => (
        <span
          className="block max-w-[160px] lg:max-w-[200px] truncate font-semibold text-white text-sm"
          title={service.name}
        >
          {service.name}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (service) => (
        <span
          className="block max-w-[180px] lg:max-w-[240px] xl:max-w-[300px] truncate text-xs text-neutral-300"
          title={service.description}
        >
          {service.description || '-'}
        </span>
      )
    },
    {
      key: 'durationMinutes',
      label: 'Duración Base',
      className: 'w-1 whitespace-nowrap',
      render: (service) => `${service.durationMinutes} min`
    },
    {
      key: 'isActive',
      label: 'Estado',
      className: 'w-1 whitespace-nowrap',
      render: (service) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${service.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {service.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'w-1 whitespace-nowrap text-right',
      render: (service) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/servicios/${service.id}`}
            title="Ver y editar servicio"
            className="h-[26px] px-2.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 hover:border-indigo-500/40 text-xs font-medium transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <span>Ver</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setModalData(service);
              setModalType('status');
            }}
            title={service.isActive ? 'Desactivar servicio' : 'Activar servicio'}
            className={`w-[76px] h-[26px] rounded-md text-xs font-medium transition-all flex items-center justify-center cursor-pointer active:scale-95 ${service.isActive
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 hover:border-amber-500/40'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/40'
              }`}
          >
            <span>{service.isActive ? 'Desactivar' : 'Activar'}</span>
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Servicios</h1>
          <p className="text-xs text-neutral-400 mt-1">Catálogo de servicios base disponibles</p>
        </div>

        <button
          onClick={() => {
            setModalData(null);
            setModalType('create');
          }}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          + Crear Servicio
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center flex-1 w-full">

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Buscar por nombre
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filters.name}
                onChange={handleSearchChange}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full md:w-44">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Estado
              </label>
              <select
                value={filters.isActive}
                onChange={handleStatusFilterChange}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none cursor-pointer focus:border-indigo-500 transition-colors w-full"
              >
                <option value="" className="bg-neutral-900">Todos</option>
                <option value="1" className="bg-neutral-900">Activos</option>
                <option value="0" className="bg-neutral-900">Inactivos</option>
              </select>
            </div>

            <div className="flex items-end gap-2 w-full md:w-auto">
              <div className="flex flex-col gap-1.5 w-full md:w-44">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={handleSortByChange}
                  className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none cursor-pointer focus:border-indigo-500 transition-colors w-full"
                >
                  <option value="" className="bg-neutral-900">Por defecto</option>
                  <option value="name" className="bg-neutral-900">Nombre</option>
                  <option value="id" className="bg-neutral-900">Código</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleToggleDescending}
                className="h-[38px] px-3.5 bg-black border border-white/10 hover:bg-white/10 rounded-lg text-xs text-white transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0 font-medium"
                title={filters.isDescending ? "Orden Descendente" : "Orden Ascendente"}
              >
                <span>{filters.isDescending ? "↓ Desc" : "↑ Asc"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-neutral-400 gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium">Cargando servicios...</span>
        </div>
      ) : (
        <Table columns={columns} data={services} />
      )}

      {!loading && pagination && (
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

      {/* Crear */}
      <CreateForm
        isOpen={modalType === 'create'}
        onClose={closeModal}
        onSuccess={refreshList}
      />

      {/* Estado */}
      <ChangeStatusModal
        isOpen={modalType === 'status'}
        service={modalData}
        onClose={closeModal}
        onSuccess={refreshList}
      />
    </div>
  );
};

export default ServicesPage;
