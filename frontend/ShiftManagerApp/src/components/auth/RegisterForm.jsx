import Modal from '../ui/Modal'

const RegisterForm = ({ isOpen, onClose, onSwitch }) =>
{
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Crear Cuenta"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="FirstName" className="block text-sm font-medium text-white/70 mb-1.5">Nombre</label>
              <input id="FirstName" name="FirstName" type="text" placeholder="Ej. Juan" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="LastName" className="block text-sm font-medium text-white/70 mb-1.5">Apellido</label>
              <input id="LastName" name="LastName" type="text" placeholder="Ej. Pérez" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="DateOfBirth" className="block text-sm font-medium text-white/70 mb-1.5">Nacimiento</label>
              <input id="DateOfBirth" name="DateOfBirth" type="date" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm shadow-inner" />
            </div>
            <div>
              <label htmlFor="Gender" className="block text-sm font-medium text-white/70 mb-1.5">Género</label>
              <select id="Gender" name="Gender" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm">
                <option value="" className='bg-neutral-900'>Seleccionar</option>
                <option value="male" className='bg-neutral-900'>Masculino</option>
                <option value="female" className='bg-neutral-900'>Femenino</option>
                <option value="other" className='bg-neutral-900'>Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="PhoneNumber" className="block text-sm font-medium text-white/70 mb-1.5">Teléfono</label>
              <input id="PhoneNumber" name="PhoneNumber" type="tel" placeholder="+54..." className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="Username" className="block text-sm font-medium text-white/70 mb-1.5">Usuario</label>
              <input id="Username" name="Username" type="text" placeholder="juanperez123" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
            <input id="Email" name="Email" type="email" placeholder="nombre@ejemplo.com" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
              <input id="Password" name="Password" type="password" placeholder="••••••••" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-white/70 mb-1.5">Confirmar</label>
              <input id="ConfirmPassword" name="ConfirmPassword" type="password" placeholder="••••••••" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none text-sm" />
            </div>
          </div>

          <button className="w-full font-semibold rounded-lg transition-all px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98]">
            Crear cuenta
          </button>
          <p className='text-white/40 text-center text-sm'>
            ¿Ya tienes una cuenta? <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4">Inicia sesión.</button>
          </p>
        </form>
      </Modal>
    );
};

export default RegisterForm;