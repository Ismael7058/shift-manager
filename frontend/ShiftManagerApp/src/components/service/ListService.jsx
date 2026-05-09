import React from 'react'
import CardService from './CardService'

const ListService = ({ data, selectedIds = [], onSelect }) => {
  if (!data || data.length <=0) {
    return(
      <div className="flex flex-col items-center justify-center w-full py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl gap-3">
        <span className="material-symbols-outlined text-4xl text-white/10">person_off</span>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
          No se encontraron servicios disponibles
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <CardService 
          key={item.id} 
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          duration={item.durationMinutes}
          isSelected={selectedIds.includes(item.id)}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}

export default ListService