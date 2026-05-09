import { useState } from 'react';

const Filter = ({ filters, onFilterChange, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleStatusChange = (status) => {
    const currentStatuses = filters.statuses || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 mb-6 transition-all">
      {/* Fila Principal: Búsqueda y Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        {children}
        
        <div className="flex gap-2 w-full md:w-auto">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="bg-black border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none"
          >
            <option value="startAt">Fecha</option>
            <option value="totalAmount">Precio</option>
            <option value="status">Estado</option>
          </select>

          <button
            onClick={() => onFilterChange({ ...filters, isDescending: !filters.isDescending })}
            className="bg-black border border-white/10 rounded-lg px-4 text-white hover:bg-white/5 transition-colors"
            title={filters.isDescending ? "Descendente" : "Ascendente"}
          >
            {filters.isDescending ? "↓" : "↑"}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {isExpanded ? 'Ocultar Filtros' : 'Más Filtros'}
          </button>
        </div>
      </div>

      {/* Panel Expandible de Filtros Avanzados */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Rango de Fechas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Rango de Fechas</label>
            <div className="flex flex-col gap-2">
              <input type="date" name="dateFrom" value={filters.dateFrom || ''} onChange={handleChange} className="bg-black border border-white/10 rounded-lg p-2 text-sm text-white" />
              <input type="date" name="dateTo" value={filters.dateTo || ''} onChange={handleChange} className="bg-black border border-white/10 rounded-lg p-2 text-sm text-white" />
            </div>
          </div>

          {/* Rango de Precios */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Precio ($)</label>
            <div className="flex gap-2">
              <input type="number" name="minPrice" value={filters.minPrice || ''} onChange={handleChange} placeholder="Mín" className="w-1/2 bg-black border border-white/10 rounded-lg p-2 text-sm text-white" />
              <input type="number" name="maxPrice" value={filters.maxPrice || ''} onChange={handleChange} placeholder="Máx" className="w-1/2 bg-black border border-white/10 rounded-lg p-2 text-sm text-white" />
            </div>
          </div>

          {/* Estados */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Estados</label>
            <div className="flex flex-wrap gap-2">
              {['pending', 'confirmed', 'completed', 'canceled', 'no_show'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filters.statuses?.includes(status)
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;