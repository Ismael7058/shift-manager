import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../services/api';

const GalleryImage = ({
  isOpen = false,
  onClose,
  images = [],
  title = '',
  alt = 'Imagen'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const list = images.map((img) => {
    const url = img.imageUrl || img;
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  });


  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  const prev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((curr) => (curr === 0 ? list.length - 1 : curr - 1));
  };

  const next = (e) => {
    e?.stopPropagation();
    setCurrentIndex((curr) => (curr === list.length - 1 ? 0 : curr + 1));
  };


  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, list.length]);


  if (!isOpen || list.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer z-10 shadow-lg"
        title="Cerrar (Esc)"
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      <div
        className="relative flex items-center justify-center gap-3 sm:gap-6 w-full max-w-6xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flecha Izquierda */}
        {list.length > 1 && (
          <button
            type="button"
            onClick={prev}
            className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95"
            title="Anterior (←)"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_left</span>
          </button>
        )}


        <div className="relative flex items-center justify-center w-full max-w-4xl xl:max-w-5xl h-[70vh] sm:h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950/85">
          <img
            src={list[currentIndex]}
            alt={title || alt}
            className="w-full h-full object-contain p-2 transition-all duration-300"
          />


          {list.length > 1 && (
            <span className="absolute bottom-4 px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-mono text-white/90 shadow-md">
              {currentIndex + 1} / {list.length}
            </span>
          )}
        </div>

        {/* Flecha Derecha */}
        {list.length > 1 && (
          <button
            type="button"
            onClick={next}
            className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95"
            title="Siguiente (→)"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">chevron_right</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GalleryImage;
