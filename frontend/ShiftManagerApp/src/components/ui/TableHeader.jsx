import React from 'react';


const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr className="bg-neutral-800/50 border-b border-white/10">
        {columns.map((column, index) => (
          <th
            key={column.key || index}
            className={`px-4 lg:px-5 py-3 text-xs font-medium text-white/70 uppercase tracking-wider ${
              column.className?.includes('text-') ? '' : 'text-left'
            } ${column.className || ''}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
