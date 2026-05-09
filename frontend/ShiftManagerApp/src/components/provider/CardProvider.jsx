import React from 'react'

const CardProvider = ({ name, id, isSelected = false, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(id)}
      className="flex-none w-32 flex flex-col items-center gap-4 snap-center cursor-pointer group"
    >
      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
        isSelected 
        ? 'bg-cyan-400/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
        : 'bg-white/5 border-white/10 group-hover:border-white/30'
      }`}>
        <span className={`material-symbols-outlined text-4xl transition-colors ${isSelected ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/40'}`}>
          account_circle
        </span>
      </div>
      <p className={`text-xs uppercase font-bold transition-colors text-center leading-tight tracking-wide ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
        {name}
      </p>
    </div>
  )
}

export default CardProvider