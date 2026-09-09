import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden text-white selection:bg-indigo-500 selection:text-white">
      {/* Luces de fondo ambientales */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Rejilla decorativa sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Contenedor Principal */}
      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Badge 404 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md mb-6 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          Error 404 • Página No Encontrada
        </div>

        {/* Número 404 gigante */}
        <div className="relative mb-2">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent select-none drop-shadow-2xl">
            404
          </h1>
          <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-4xl text-indigo-400/80 animate-bounce">
            explore_off
          </span>
        </div>

        {/* Título y descripción */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          ¿Te has perdido en el camino?
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed mb-8 max-w-md">
          La dirección a la que intentas acceder no existe, ha cambiado de lugar o fue eliminada. Verifica la URL o regresa al panel principal.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Regresar</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Ir al Inicio</span>
          </Link>
        </div>

        {/* Enlaces Rápidos de Ayuda */}
        <div className="mt-12 pt-6 border-t border-white/5 w-full">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">
            Accesos directos recomendados
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
            <Link to="/turnos" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Turnos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
