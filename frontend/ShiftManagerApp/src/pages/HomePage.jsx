const HomePage = () => {

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
      <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
        Bienvenido a 
        <span className="text-white"> Shift</span>
        <span className="text-white/30">Manager</span>
      </h1>
      <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
        La solución inteligente para la gestión de turnos. 
        Optimiza tus horarios y mejora la productividad de tu equipo con <span className="text-white/80 font-semibold">ShiftManager</span>.
      </p>
    </div>
  );
};

export default HomePage;
