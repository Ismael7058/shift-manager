import React, { useEffect, useState, useMemo } from 'react';
import { useTurnos } from '../context/ShiftsContext';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import FilterShifts from '../components/shifts/FilterShifts';


const ShiftsPage = () => {
  const { shifts, loading, error, pagination, fetchShifts, isGlobal } = useTurnos();

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    sortBy: 'startAt',
    isDescending: true,
    pageNumber: 1,
    pageSize: 10,
    statuses: [],
    serviceId: ''
  });

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchShifts(filters);
    }, 500);

    return () => clearTimeout(handler);
  }, [fetchShifts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, pageNumber: 1 });
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
        <button
          onClick={() => {
            setModalType('shift');
            setModalData(shift);
          }}
          className="text-white hover:bg-white/10 focus:ring-4 focus:ring-white/10 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none transition-all"
        >
          Ver
        </button>
    }
  ], []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
        {isGlobal ? 'Gestión de Turnos' : 'Mis Turnos'}
      </h1>
      
      <FilterShifts filters={filters} onFilterChange={handleFilterChange} />

      {loading && (
        <div className="flex items-center gap-3 text-white/50 my-8 italic">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
          Cargando turnos...
        </div>
      )}

      {!loading && (
        <Table 
          columns={columns} 
          data={shifts} 
          emptyMessage={
            error 
              ? "No se pudo cargar la información de los turnos" 
              : "No se encontraron elementos con los filtros aplicados"
          } 
        />
      )}

      <Pagination 
        totalCount={pagination.totalCount}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        searchTerm={filters.searchTerm}
      />

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