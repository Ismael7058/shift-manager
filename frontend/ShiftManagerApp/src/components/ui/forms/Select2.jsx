import React, { useState, useRef, useEffect } from 'react'

const Select2 = ({ 
  items = [], 
  value, 
  onSelect, 
  onSearch, 
  placeholder = "Buscar...", 
  loading = false,
  emptyMessage = "No se encontraron resultados",
  valueKey = 'id', 
  labelKey = 'name' 
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si hace clicl fuera del div se cierra el menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (isOpen) return;

    const selectedItem = items.find(item => item[valueKey] === value);
    if (selectedItem) {
      setSearchTerm(selectedItem[labelKey]);
    } else if (!value) {
      setSearchTerm('');
    }
  }, [value, items, valueKey, labelKey, isOpen]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleItemClick = (item) => {
    onSelect(item[valueKey]);
    setSearchTerm(item[labelKey]);
    setIsOpen(false);
  };

  // Selecciona la primera opcion al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && items.length > 0 && isOpen) {
      handleItemClick(items[0]);
      e.preventDefault();
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect('');
    setSearchTerm('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/30"
      />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* Indicador de carga (spinner) */}
        {loading && (
          <div className="w-3 h-3 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        )}
        {(searchTerm || value) && (
          <button 
            type="button"
            onClick={handleClear}
            className="text-white/30 hover:text-white transition-colors text-xs"
            title="Limpiar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Menú Desplegable con Resultados */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li 
                key={item[valueKey] ?? index}
                onClick={() => handleItemClick(item)}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-white/5 transition-colors 
                  ${value === item[valueKey] ? 'bg-white/10 text-white font-medium' : 'text-white/70'}`}
              >
                {item[labelKey]}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-white/30 italic text-center">
              {loading ? 'Buscando...' : emptyMessage}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default Select2