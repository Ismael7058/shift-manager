import React from 'react'
import CardProvider from './CardProvider'

const SupplierCarousel = ({ data, selectedId, onSelect }) => {
  if (!data || data.length <=0) {
    return(
      <div className="flex flex-col items-center justify-center w-full py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl gap-3">
        <span className="material-symbols-outlined text-4xl text-white/10">person_off</span>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">No se encontraron profesionales disponibles</p>
      </div>
    )
  }

  return (
    <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
      {data.map((item) => (
        <CardProvider 
          key={item.id} 
          id={item.id}
          name={item.firstName + " " + item.lastName} 
          isSelected={item.id === selectedId}
          onClick={onSelect}
        />
      ))}
    </div>  
  )
}

export default SupplierCarousel