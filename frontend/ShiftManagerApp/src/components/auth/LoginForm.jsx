import { useState } from 'react'
import Modal from '../ui/Modal'

const LoginForm = ({ isOpen, onClose, onSwitch }) =>
{
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Iniciar Sesión"
      >
        <form className="space-y-4">
          <p className='text-white/85'>
            Inicie sesión en su cuenta de
            <span className='font-semibold'> ShiftManager</span>
            </p>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
            <input type="email" placeholder="nombre@ejemplo.com" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all outline-none" />
          </div>
          <button className="w-full font-semibold rounded-lg transition-all px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 active:scale-[0.98]">
            Login
          </button>
          <p className='text-white/40 text-center text-sm'>
            ¿No tienes una cuenta? <button type="button" onClick={onSwitch} className="text-white hover:underline underline-offset-4">Registrate aquí.</button>
          </p>
        </form>
      </Modal>
    );
};

export default LoginForm;