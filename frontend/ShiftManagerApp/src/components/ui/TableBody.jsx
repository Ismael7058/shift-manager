import React from 'react';


const TableBody = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-white/60">No hay datos disponibles.</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-white/5">
      {data.map((row, rowIndex) => (
        <tr key={row.id || rowIndex} className="hover:bg-neutral-800/30 transition-colors">
          {columns.map((column, colIndex) => (
            <td key={column.key || colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{column.render ? column.render(row) : row[column.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
