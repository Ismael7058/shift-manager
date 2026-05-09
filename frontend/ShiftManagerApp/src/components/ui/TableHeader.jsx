import React from 'react';


const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr className="bg-neutral-800/50 border-b border-white/10">
        {columns.map((column, index) => (
          <th key={column.key || index} className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">{column.label}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
