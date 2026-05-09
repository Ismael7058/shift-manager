import React from 'react'

const CardService = ({ name, id, description, price, duration , isSelected = false, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(id)}
      className={`bg-white/5 p-5 flex justify-between items-start cursor-pointer group hover:bg-white/10 transition-all rounded-lg border-2 ${
        isSelected
          ? 'border-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.1)]'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex-1 pr-4 space-y-1">
        <h3 className="font-bold text-white uppercase tracking-tight text-lg">{name}</h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-4 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {duration} MIN
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); /* abrir modal */ }}
            className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Ver ejemplos
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between self-stretch">
        <div 
          className={`
          w-6 h-6 rounded-full
           ${isSelected
              ? 'bg-cyan-300 flex items-center justify-center shadow-[0_0_10px_rgba(103,232,249,0.3)]'
              : ' border-2 border-white/10 group-hover:border-white/30 transition-colors'
            }`}

        >
          {isSelected && (
            <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          )}
        </div>
        <span className="font-headline-md text-white text-xl font-bold">
          ${price?.toLocaleString('es-AR')}
        </span>
      </div>
    </div>
  )
}

export default CardService