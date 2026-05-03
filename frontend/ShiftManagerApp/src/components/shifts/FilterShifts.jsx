import React, { useEffect, useState } from 'react'
import { useService } from '../../context/ServicesContext'
import Filter from '../ui/Filter'
import Select2 from '../ui/forms/Select2'

const FilterShifts = ({ filters, onFilterChange }) => {
  const { services, loading, fetchServices } = useService();
  const [serviceQuery, setServiceQuery] = useState('');


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices({ name: serviceQuery, pageSize: 10, sortBy: 'name', isDescending: false });
    }, 500);

    // Limpiar el timer si se sigue escribiendo
    return () => clearTimeout(delayDebounceFn);
  }, [serviceQuery, fetchServices]);

  return (
    <Filter filters={filters} onFilterChange={onFilterChange}>
      <div className="flex flex-col gap-2 w-full md:w-4/12 mt-4 md:mt-0">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Servicios</label>
        <Select2 
          items={services}
          value={filters.serviceId}
          onSelect={(id) => onFilterChange({ ...filters, serviceId: id })}
          onSearch={(query) => setServiceQuery(query)}
          loading={loading}
          placeholder="Buscar servicio..."
          valueKey="id"
          labelKey="name"
        />
      </div>
    </Filter>
  );
};

export default FilterShifts;
