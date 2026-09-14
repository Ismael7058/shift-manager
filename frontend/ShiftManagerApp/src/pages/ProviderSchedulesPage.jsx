import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkSchedules } from '../context/WorkSchedulesContext';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import CreateProviderScheduleModal from '../components/provider/CreateProviderScheduleModal';
import EditProviderScheduleModal from '../components/provider/EditProviderScheduleModal';
import ChangeStatusProviderScheduleModal from '../components/provider/ChangeStatusProviderScheduleModal';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ProviderSchedulesPage = () => {
  const { user } = useAuth();
  const { id: providerId } = useParams();
  const currentProviderId = providerId || user?.id;

  const {
    workSchedules,
    loading,
    pagination,
    getAllWorkSchedules
  } = useWorkSchedules();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [filters, setFilters] = useState({
    dayOfWeek: '',
    isActive: '',
    sortBy: 'dayOfWeek',
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  });

  const refreshList = () => {
    if (!currentProviderId) return;
    getAllWorkSchedules(
      currentProviderId,
      filters.dayOfWeek,
      filters.isActive,
      filters.sortBy,
      filters.isDescending,
      filters.pageNumber,
      filters.pageSize
    );
  };

  useEffect(() => {
    refreshList();
  }, [currentProviderId, filters]);


  const handleDayFilterChange = (e) => {
    setFilters(prev => ({ ...prev, dayOfWeek: e.target.value, pageNumber: 1 }));
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


  const openCreateModal = () => setIsCreateOpen(true);

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditOpen(true);
  };

  const openStatusModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsStatusOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsStatusOpen(false);
    setSelectedSchedule(null);
  };

  // Columnas de la tabla
  const columns = useMemo(() => [
    {
      key: 'dayOfWeek',
      label: 'Día',
      render: (schedule) => (
        <span className="font-semibold text-white text-sm">
          {DAYS[schedule.dayOfWeek]}
        </span>
      )
    },
    {
      key: 'startTime',
      label: 'Hora Inicio',
      render: (schedule) => (
        <span className="font-mono text-xs text-neutral-200 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/10">
          {schedule.startTime?.slice(0, 5) || schedule.startTime}
        </span>
      )
    },
    {
      key: 'endTime',
      label: 'Hora Fin',
      render: (schedule) => (
        <span className="font-mono text-xs text-neutral-200 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/10">
          {schedule.endTime?.slice(0, 5) || schedule.endTime}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      className: 'w-1 whitespace-nowrap',
      render: (schedule) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${schedule.isActive
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
          {schedule.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'w-1 whitespace-nowrap text-right',
      render: (schedule) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openEditModal(schedule)}
            title="Editar horario"
            className="h-[26px] px-2.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 hover:border-indigo-500/40 text-xs font-medium transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => openStatusModal(schedule)}
            title={schedule.isActive ? 'Desactivar horario' : 'Activar horario'}
            className={`w-[76px] h-[26px] rounded-md text-xs font-medium transition-all flex items-center justify-center cursor-pointer active:scale-95 ${schedule.isActive
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 hover:border-amber-500/40'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/40'
              }`}
          >
            <span>{schedule.isActive ? 'Desactivar' : 'Activar'}</span>
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          {providerId && (
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/proveedores"
                className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>← Volver a Proveedores</span>
              </Link>
            </div>
          )}
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Horarios de Trabajo
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona las jornadas laborales y la disponibilidad horaria.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Crear Horario</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Día de la semana
            </label>
            <select
              value={filters.dayOfWeek}
              onChange={handleDayFilterChange}
              className="px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="" className="bg-neutral-900">Todos los días</option>
              <option value="1" className="bg-neutral-900">Lunes</option>
              <option value="2" className="bg-neutral-900">Martes</option>
              <option value="3" className="bg-neutral-900">Miércoles</option>
              <option value="4" className="bg-neutral-900">Jueves</option>
              <option value="5" className="bg-neutral-900">Viernes</option>
              <option value="6" className="bg-neutral-900">Sábado</option>
              <option value="0" className="bg-neutral-900">Domingo</option>
            </select>
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
              <option value="1" className="bg-neutral-900">Activos</option>
              <option value="0" className="bg-neutral-900">Inactivos</option>
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
                className="flex-1 px-3 py-2 bg-neutral-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="dayOfWeek" className="bg-neutral-900">Día de la semana</option>
                <option value="startTime" className="bg-neutral-900">Hora inicio</option>
              </select>
              <button
                type="button"
                onClick={handleToggleDescending}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 font-bold text-white rounded-lg border border-white/10 text-xs transition-colors cursor-pointer"
                title={filters.isDescending ? 'Descendente' : 'Ascendente'}
              >
                {filters.isDescending ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50 space-x-2">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm">Cargando horarios...</span>
        </div>
      ) : workSchedules.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-neutral-900/20">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/40">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <p className="text-white font-medium text-base">No hay horarios registrados</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            No se encontraron horarios de trabajo.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            + Crear Primer Horario
          </button>
        </div>
      ) : (
        <>
          <Table
            data={workSchedules}
            columns={columns}
            keyExtractor={(schedule) => schedule.id || `${schedule.dayOfWeek}-${schedule.startTime}`}
          />
          <div className="mt-4">
            <Pagination
              currentPage={pagination.pageNumber || 1}
              totalPages={pagination.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      <CreateProviderScheduleModal
        isOpen={isCreateOpen}
        onClose={closeModals}
        providerId={currentProviderId}
        onSuccess={refreshList}
      />

      <EditProviderScheduleModal
        isOpen={isEditOpen}
        onClose={closeModals}
        schedule={selectedSchedule}
        onSuccess={refreshList}
      />

      <ChangeStatusProviderScheduleModal
        isOpen={isStatusOpen}
        onClose={closeModals}
        schedule={selectedSchedule}
        onSuccess={refreshList}
      />
    </div>
  );
};

export default ProviderSchedulesPage;
