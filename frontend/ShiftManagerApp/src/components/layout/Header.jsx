import { useState } from 'react'
import Modal from '../ui/Modal'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'

const Header = ({ element }) => {
  const [modalType, setModalType] = useState(null)

  const closeModal = () => setModalType(null)

  return (
    <header className="flex w-full flex-row items-center justify-between py-2.5 px-7 shadow-md border-b border-white/10">
        <div>
          {element}
          <a href="/" className="text-2xl text-white/50 font-bold tracking-tighter transition-all">
            Shift
            <span className='text-white/30'>Manager</span>
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalType('login')}
            className="font-semibold bg-transparent rounded-md border border-gray-200 px-3 py-1.5 text-white  hover:bg-gray-200 transition hover:text-neutral-950 hover:border-transparent "
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setModalType('register')}
            className="font-semibold rounded-md border transition px-3 py-1.5 bg-gray-200  text-neutral-950 border-transparent hover:bg-gray-300 hover:border-gray-300"
          >
            Registrarse
          </button>
        </div>
      {/* Modal de Inicio de Sesión */}
      <LoginForm 
        isOpen={modalType === 'login'} 
        onClose={closeModal} 
        onSwitch={() => setModalType('register')} 
      />

      {/* Modal de Registro */}
      <RegisterForm 
        isOpen={modalType === 'register'} 
        onClose={closeModal} 
        onSwitch={() => setModalType('login')} 
      />
    </header>
  )
}

export default Header