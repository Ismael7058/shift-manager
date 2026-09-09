import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClient } from '../context/ClientContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5256';

const ClientsPage = () => {
  const { clients, loading, pagination, getClients } = useClient();

  const [filters, setFilters] = useState({
    name: '',
    sortBy: '',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  const refreshList = () => {
    getClients(
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

  // Handlers de filtros y paginación
  const handleNameFilterChange = (e) => {
    setFilters(prev => ({ ...prev, name: e.target.value, pageNumber: 1 }));
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

  // Columnas
  const columns = useMemo(() => [
    {
      key: 'picture',
      label: 'Foto',
      className: 'w-1 whitespace-nowrap',
      render: (client) => {
        const imgUrl = client.pictureURL;
        const fullImgSrc = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${API_BASE_URL}${imgUrl}`) : null;

        if (fullImgSrc) {
          return (
            <img
              src={fullImgSrc}
              alt={`${client.firstName || ''} ${client.lastName || ''}`}
              className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
            />
          );
        }

        return (
          <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xs border border-white/10 shadow-sm">
            {client.firstName?.charAt(0) || ''}{client.lastName?.charAt(0) || ''}
          </div>
        );
      }
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (client) => `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.username
    },
    {
      key: 'email',
      label: 'Email',
      render: (client) => <span className="text-neutral-300">{client.email || '-'}</span>
    },
    {
      key: 'phoneNumber',
      label: 'Teléfono',
      render: (client) => <span className="text-neutral-300">{client.phoneNumber || '-'}</span>
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'w-1 whitespace-nowrap text-right',
      render: (client) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/turnos?clientId=${client.id}`}
            title="Ver turnos de este cliente"
            className="h-[26px] px-2 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 hover:border-indigo-500/40 text-xs font-medium transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <span>Turnos</span>
          </Link>
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Clientes</h1>
          <p className="text-xs text-neutral-400 mt-1">Catálogo de clientes registrados en el sistema</p>
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

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-neutral-400 gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium">Cargando clientes...</span>
        </div>
      ) : (
        <Table columns={columns} data={clients || []} />
      )}

      {/* Paginación */}
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
    </div>
  );
};

export default ClientsPage;
