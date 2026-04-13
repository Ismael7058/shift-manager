import React from 'react'
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = ({ columns, data }) => {
  if (!columns || columns.length === 0) {
    console.warn("Table component requires 'columns' prop to be an array with at least one column definition.");
    return <div className="text-white/60 text-center py-4">No se han definido columnas para la tabla.</div>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <TableHeader columns={columns} />
        <TableBody data={data} columns={columns} />
      </table>
    </div>
  )
}

export default Table