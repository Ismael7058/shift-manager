import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Dividimos la ruta actual para obtener los segmentos
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  return (
    <nav className="flex items-center space-x-2 text-sm font-medium mb-2 container mx-auto px-4" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="text-white/40 hover:text-white transition-colors"
      >
        Inicio
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        const name = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center space-x-2">
            <span className="text-white/10 font-thin">/</span>
            {last ? (
              <span className="text-white cursor-default">{name}</span>
            ) : (
              <Link to={to} className="text-white/40 hover:text-white transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;