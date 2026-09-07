import React, { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({
  label,
  required = false,
  placeholder = 'Buscar...',
  selected = null,
  items = [],
  loading = false,
  emptyMessage = 'No se encontraron resultados',
  searchValue = '',
  onSearchChange,
  onSelect,
  onClear,
  getLabel = (item) => item?.name || '',
  getSublabel = null,
  getAvatarText = null,
  accentColor = 'cyan', // 'cyan' | 'indigo' | 'purple'
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar al hacer clic fuera o presionar la tecla Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Paleta de colores según accentColor
  const colorMap = {
    cyan: {
      avatar: 'bg-cyan-500 text-neutral-950',
      borderSelected: 'border-cyan-500/30',
      focusBorder: 'focus:border-cyan-500',
      actionText: 'text-cyan-400',
      spinner: 'border-cyan-500',
      changeLink: 'text-cyan-400'
    },
    indigo: {
      avatar: 'bg-indigo-600 text-white',
      borderSelected: 'border-indigo-500/30',
      focusBorder: 'focus:border-cyan-500',
      actionText: 'text-cyan-400',
      spinner: 'border-cyan-500',
      changeLink: 'text-cyan-400'
    },
    purple: {
      avatar: 'bg-purple-600 text-white',
      borderSelected: 'border-purple-500/30',
      focusBorder: 'focus:border-purple-500',
      actionText: 'text-purple-400',
      spinner: 'border-purple-500',
      changeLink: 'text-purple-400'
    }
  };

  const theme = colorMap[accentColor] || colorMap.cyan;

  const handleClearSelection = () => {
    if (onClear) onClear();
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectItem = (item) => {
    if (onSelect) onSelect(item);
    setIsOpen(false);
  };

  const defaultAvatar = (item) => {
    if (!item) return '?';
    if (getAvatarText) return getAvatarText(item);
    const text = getLabel(item);
    return text ? text.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Etiqueta superior */}
      {label && (
        <label className="text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-400">*</span>}
          </span>
          {selected && (
            <button
              type="button"
              onClick={handleClearSelection}
              className={`text-[11px] ${theme.changeLink} hover:underline cursor-pointer`}
            >
              Cambiar
            </button>
          )}
        </label>
      )}

      {selected ? (
        /* Tarjeta de elemento seleccionado */
        <div className={`h-12 flex items-center justify-between px-3 rounded-xl bg-neutral-950/70 border ${theme.borderSelected}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-full ${theme.avatar} flex items-center justify-center text-xs font-bold shrink-0`}>
              {defaultAvatar(selected)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold text-white truncate">
                {getLabel(selected)}
              </p>
              {getSublabel && (
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                  {getSublabel(selected)}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
            title={`Cambiar ${label || 'elemento'}`}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ) : (
        /* Buscador con menú desplegable flotante */
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-base pointer-events-none">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              className={`w-full h-12 bg-neutral-950/70 border border-white/10 rounded-xl pl-9 pr-8 text-xs text-white placeholder:text-neutral-500 focus:outline-none ${theme.focusBorder} transition-colors`}
            />
            <span className={`material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>

          {/* Menú Flotante */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-2xl divide-y divide-white/5">
              {loading ? (
                <div className="p-3 text-center text-neutral-400 text-xs flex items-center justify-center gap-2">
                  <div className={`w-3.5 h-3.5 border-2 ${theme.spinner} border-t-transparent rounded-full animate-spin`}></div>
                  <span>Buscando...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="p-3 text-center text-neutral-500 text-xs">
                  {emptyMessage}
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    onClick={() => handleSelectItem(item)}
                    className="p-2.5 hover:bg-neutral-800/80 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {getLabel(item)}
                      </p>
                      {getSublabel && (
                        <p className="text-[10px] text-neutral-400 truncate">
                          {getSublabel(item)}
                        </p>
                      )}
                    </div>
                    <span className={`text-[10px] ${theme.actionText} font-medium ml-2 shrink-0`}>
                      Elegir
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
