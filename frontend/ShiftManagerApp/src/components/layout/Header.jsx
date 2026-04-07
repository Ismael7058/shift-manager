import { useState } from 'react'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'

import { useAuth } from '../../context/AuthContext'

const Header = ({ element }) => {
  const [modalType, setModalType] = useState(null)
  const [isOpen, setIsOpen] = useState(false);

  const { user, logoutUser } = useAuth();

  const closeModal = () => setModalType(null)

  const handleLoginSuccess = () => {
    setModalType(null);
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
    }
  };


  return (
    <header className="w-full">
      <nav className="bg-neutral-950/50 backdrop-blur-md border-b border-white/10 px-4 lg:px-7 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            {element}
            <a href="/" className="flex items-center text-2xl text-white font-bold tracking-tighter transition-all">
              Shift
              <span className='text-white/30'>Manager</span>
            </a>
          </div>

          <div className="flex items-center lg:order-2 gap-2">
            {user ? (
              // Nombre y boton de salir
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end leading-tight sm:flex">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-white/40 text-[10px]">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/50 hover:text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setModalType('login')}
                  className="text-white hover:bg-white/10 focus:ring-4 focus:ring-white/10 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none transition-all"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setModalType('register')}
                  className="text-neutral-950 bg-white hover:bg-neutral-200 focus:ring-4 focus:ring-white/20 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none transition-all"
                >
                  Registrarse
                </button>
              </>
            )}



            <button 
              type="button" 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-sm text-white/60 rounded-lg lg:hidden hover:bg-white/5 focus:outline-none transition-all"
              data-collapse-toggle="mobile-menu-2" aria-controls="mobile-menu-2" aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              <div className="flex flex-col justify-between w-6 h-4 transform transition-all duration-300 origin-center">
                {/* Línea Superior */}
                <div className={`bg-white h-[2px] w-full rounded transform transition-all duration-300 origin-left ${isOpen ? 'rotate-45 translate-x-1 translate-y-[-1px]' : ''}`}></div>
                {/* Línea Central (se oculta al abrir) */}
                <div className={`bg-white h-[2px] w-full rounded transform transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                {/* Línea Inferior */}
                <div className={`bg-white h-[2px] w-full rounded transform transition-all duration-300 origin-left ${isOpen ? '-rotate-45 translate-x-1 translate-y-[1px]' : ''}`}></div>
              </div>
            </button>
          </div>

          <div className={`${isOpen ? 'flex' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a href="/" className="block py-2 pr-4 pl-3 text-white lg:p-0 hover:text-white/80 transition-colors" aria-current="page">Inicio</a>
              </li>
              <li>
                <a href="/docs" className="block py-2 pr-4 pl-3 text-white/50 border-b border-white/5 hover:bg-white/5 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 transition-colors">Docs</a>
              </li>
              <li>
                <a href="#" className="block py-2 pr-4 pl-3 text-white/50 border-b border-white/5 hover:bg-white/5 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 transition-colors">Mercado</a>
              </li>
              <li>
                <a href="#" className="block py-2 pr-4 pl-3 text-white/50 border-b border-white/5 hover:bg-white/5 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 transition-colors">Funciones</a>
              </li>
              <li>
                <a href="#" className="block py-2 pr-4 pl-3 text-white/50 border-b border-white/5 hover:bg-white/5 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 transition-colors">Equipo</a>
              </li>
              <li>
                <a href="#" className="block py-2 pr-4 pl-3 text-white/50 border-b border-white/5 hover:bg-white/5 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 transition-colors">Contacto</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal de Inicio de Sesion */}
      <LoginForm 
        isOpen={modalType === 'login'} 
        onClose={closeModal} 
        onLoginSuccess={handleLoginSuccess}
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