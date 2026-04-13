/**
 * @param {object} props
 * @param {number} props.totalCount
 * @param {number} props.pageNumber
 * @param {number} props.pageSize
 * @param {number} props.totalPages
 * @param {function(number): void} props.onPageChange
 * @param {string} [props.searchTerm]
 */
const Pagination = ({ totalCount, pageNumber, pageSize, totalPages, onPageChange, searchTerm }) => {
  if (totalPages <= 1) return null;

  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageNumber <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (pageNumber >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', pageNumber - 1, pageNumber, pageNumber + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalCount}</span> resultados
            {searchTerm && (
              <>
                {' '}
                para{' '}
                <span className="font-medium italic text-white/90">"{searchTerm}"</span>
              </>
            )}
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            <button
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={pageNumber <= 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 border border-white/10 hover:bg-white/5 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5">
                <path d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>

            {getPages().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 border border-white/10 cursor-default">
                    ...
                  </span>
                );
              }
              const isCurrent = page === pageNumber;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border border-white/10 focus:z-20 transition-all ${isCurrent 
                    ? 'z-10 bg-white/20 text-white border-white/20 shadow-inner' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={pageNumber >= totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 border border-white/10 hover:bg-white/5 focus:z-20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Siguiente</span>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5">
                <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination