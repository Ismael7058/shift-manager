import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRole } from '../context/RoleContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';

const UsersPage = () => {
  const { users, loading, pagination, getUsers } = useUser();
  const { roles, getRoles } = useRole();
  const [addRole, setAddRole] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    username: '',
    role: '',
    isActive: '',
    sortBy: '',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  useEffect(() => {
    if (getRoles) {
      getRoles();
    }
  }, []);


  const refreshList = () => {
    getUsers(
      filters.name,
      filters.email,
      filters.username,
      filters.role,
      filters.isActive,
      filters.sortBy,
      filters.isDescending,
      filters.pageNumber,
      filters.pageSize
    );
  };

  useEffect(() => {
    refreshList();
  }, [filters.name, filters.email, filters.username, filters.role, filters.isActive, filters.sortBy, filters.isDescending, filters.pageNumber, filters.pageSize]);


  // Handlers
  const handleNameFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, name: value, pageNumber: 1 }));
  };

  const handleEmailFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, email: value, pageNumber: 1 }));
  };

  const handleUsernameFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, username: value, pageNumber: 1 }));
  };

  const handleRoleFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, role: value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, isActive: value, pageNumber: 1 }));
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

  // Columnas de la tabla de Usuarios
  const columns = useMemo(() => [
    { key: 'id', label: 'Código' },
    { key: 'name', label: 'Nombre', render: (user) => user.firstName + ' ' + user.lastName },
    { key: 'email', label: 'Email' },
    { key: 'username', label: 'Usuario' },
    { key: 'role', label: 'Roles', render: (user) => user.roles.join(', ') },
    { key: 'isActive', label: 'Estado', render: (user) => user.isActive ? 'Activo' : 'Inactivo' },
    {
      key: 'actions', label: 'Acciones', render: (user) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/usuarios/${user.id}`}
            className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Ver
          </Link>
        </div>
      )
    }
  ], []);


  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-xs text-neutral-400 mt-1">Catálogo de usuarios disponibles</p>
        </div>

        <Link
          to="/usuarios/nuevo"
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          + Crear Usuario
        </Link>
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Email
            </label>
            <input
              type="text"
              placeholder="Buscar por email..."
              value={filters.email}
              onChange={handleEmailFilterChange}
              className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              placeholder="Buscar por usuario..."
              value={filters.username}
              onChange={handleUsernameFilterChange}
              className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
            />
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Role
            </label>
            <select
              value={filters.role}
              onChange={handleRoleFilterChange}
              className="px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white outline-none cursor-pointer focus:border-indigo-500 transition-colors w-full"
            >
              <option value="" className="bg-neutral-900">Todos</option>
              {roles ? roles.map((rol) => (
                <option key={rol.id} value={rol.id} className="bg-neutral-900 capitalize">
                  {rol.name}
                </option>
              )) : <option value="" className="bg-neutral-900">Sin roles</option>}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
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
                <option value="email" className="bg-neutral-900">Email</option>
                <option value="username" className="bg-neutral-900">Username</option>
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
          <span className="text-xs font-medium">Cargando usuarios...</span>
        </div>
      ) : (
        <Table columns={columns} data={users} />
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
    </div>
  );
};

export default UsersPage;
