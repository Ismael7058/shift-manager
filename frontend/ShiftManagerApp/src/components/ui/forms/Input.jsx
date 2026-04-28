const Input = ({ tipe, name, value, placeholder, handleChange }) => {
  return (
    <input
      type={tipe}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full bg-black border border-white/10 rounded-lg py-2 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
    />
  )
}

export default Input