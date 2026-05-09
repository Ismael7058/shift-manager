const Select = ({ items = [], name, value, handleChange, valueKey = 'id', labelKey = 'name' }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      className="bg-black border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none"
    >
      <option value="">Seleccionar</option>
      {items.map((item, index) => (
        <option key={item[valueKey] || index} value={item[valueKey]}>
          {item[labelKey]}
        </option>
      ))}
    </select>
  )
};

export default Select;