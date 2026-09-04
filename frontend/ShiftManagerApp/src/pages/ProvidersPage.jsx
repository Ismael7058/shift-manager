import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProvider } from '../context/ProviderContext';
import { useWorkSchedules } from '../context/WorkSchedulesContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import ProviderDetailModal from '../components/provider/DetailProviderModal';

const BASE_URL = 'http://localhost:5256';

const ProviderPage = () => {
  const { providers, loading, pagination, getProviders } = useProvider();
  const { workSchedules, getAllWorkSchedules } = useWorkSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [filters, setFilters] = useState({
    name: '',
    sortBy: '',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  const refreshList = () => {
    getProviders(
      filters.name,
      filters.sortBy,
      filters.isDescending,
      filters.pageNumber,
      filters.pageSize
    );
  };

  useEffect(() => {
    refreshList();
  }, [filters.name, filters.sortBy, filters.isDescending, filters.pageNumber, filters.pageSize]);

  // Handlers
  const handleNameFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, name: value, pageNumber: 1 }));
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

  const handleOpenProviderModal = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);

    getAllWorkSchedules(provider.id, '', 1, 'day_of_week', false, 1, 20);
  };

  // Columnas de la tabla de Proveedores
  const columns = useMemo(() => [
    { key: 'id', label: 'Código' },
    {
      key: 'picture',
      label: 'Foto',
      render: (provider) => {
        const imgUrl = provider.pictureURL;
        const fullImgSrc = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${BASE_URL}${imgUrl}`) : null;

        if (fullImgSrc) {
          return (
            <img
              src={fullImgSrc}
              alt={`${provider.firstName || ''} ${provider.lastName || ''}`}
              className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
            />
          );
        }

        return (
          <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xs border border-white/10 shadow-sm">
            {provider.firstName?.charAt(0) || ''}{provider.lastName?.charAt(0) || ''}
          </div>
        );
      }
    },
    { key: 'name', label: 'Nombre', render: (provider) => provider.firstName + ' ' + provider.lastName },
    {
      key: 'actions', label: 'Acciones', render: (provider) => (
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            onClick={() => handleOpenProviderModal(provider)}
          >
            Ver
          </button>
        </div>
      )
    }
  ], []);


  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Proveedores</h1>
          <p className="text-xs text-neutral-400 mt-1">Catálogo de proveedores disponibles</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={handleNameFilterChange}
              className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1.5 flex-1">
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
              </select>
            </div>

            <button
              type="button"
              onClick={handleToggleDescending}
              className="h-[38px] px-3 bg-black border border-white/10 hover:bg-white/10 rounded-lg text-xs text-white transition-colors cursor-pointer flex items-center justify-center shrink-0 font-medium"
              title={filters.isDescending ? "Orden Descendente" : "Orden Ascendente"}
            >
              <span>{filters.isDescending ? "↓ Desc" : "↑ Asc"}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-neutral-400 gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium">Cargando proveedores...</span>
        </div>
      ) : (
        <Table columns={columns} data={providers} />
      )}

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

      <ProviderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={selectedProvider}
        schedules={workSchedules}
        loadingSchedules={loading}
      />
    </div>
  );
};

export default ProviderPage;
