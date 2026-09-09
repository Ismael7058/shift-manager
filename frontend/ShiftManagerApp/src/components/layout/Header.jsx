import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';
import MeProfile from '../profile/MeProfile';

const API_BASE_URL = 'http://localhost:5256';

const Header = () => {
  const { user, logout } = useAuth();
  const [modalType, setModalType] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const currentRole = user?.roleActive || 'Cliente';

  const closeModal = () => setModalType(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
  };

  const renderNavItem = (to, label, end = false) => (
    <li key={to}>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `text-base transition-colors py-1 ${isActive
            ? 'font-semibold text-indigo-400'
            : 'font-medium text-white/60 hover:text-white'
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );

  return (
    <header className="sticky top-0 z-40 w-full max-w-[100vw]">
      <nav className="relative bg-neutral-950/70 backdrop-blur-md border-b border-white/10 px-7 py-2.5 w-full max-w-[100vw]">
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center text-2xl text-white font-bold tracking-tighter transition-all hover:opacity-90"
            >
              Shift
              <span className="text-white/30">Manager</span>
            </Link>
          </div>

          {user && (
            <ul className="flex items-center space-x-8">
              {currentRole === 'Administrador' && (
                <>
                  {renderNavItem('/', 'Inicio', true)}
                  {renderNavItem('/clientes', 'Clientes')}
                  {renderNavItem('/proveedores', 'Proveedores')}
                  {renderNavItem('/servicios', 'Servicios')}
                  {renderNavItem('/turnos', 'Turnos')}
                  {renderNavItem('/usuarios', 'Usuarios')}
                </>
              )}

              {currentRole === 'Proveedor' && (
                <>
                  {renderNavItem('/', 'Inicio', true)}
                  {renderNavItem('/servicios', 'Servicios')}
                  {renderNavItem('/horarios', 'Horarios')}
                  {renderNavItem('/turnos', 'Turnos')}
                </>
              )}

              {currentRole === 'Recepcion' && (
                <>
                  {renderNavItem('/', 'Inicio', true)}
                  {renderNavItem('/proveedores', 'Proveedores')}
                  {renderNavItem('/clientes', 'Clientes')}
                  {renderNavItem('/turnos', 'Turnos')}
                </>
              )}

              {currentRole === 'Cliente' && (
                <>
                  {renderNavItem('/', 'Inicio', true)}
                  {renderNavItem('/turnos', 'Turnos', true)}
                  {renderNavItem('/turnos/nuevo', 'Crear Turnos')}
                </>
              )}
            </ul>
          )}

          <div className="flex items-center shrink-0">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-left"
                  aria-expanded={showProfileMenu}
                >
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-semibold text-sm truncate max-w-[160px]">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-white/40 text-[11px] truncate max-w-[160px]">
                      {user.email}
                    </span>
                  </div>

                  {user.pictureURL ? (
                    <img
                      src={`${API_BASE_URL}${user.pictureURL}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </div>
                  )}

                  <span className="material-symbols-outlined text-[18px] text-white/60">
                    {showProfileMenu ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 border border-white/10 rounded-xl shadow-xl bg-neutral-900">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-neutral-200 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-400">person</span>
                      Gestionar Perfil
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/15 hover:text-red-300 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-white/10 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px] text-red-400">logout</span>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalType('login')}
                  className="text-white hover:bg-white/10 font-medium rounded-lg text-sm px-4 py-2 transition-all cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setModalType('register')}
                  className="text-neutral-950 bg-white hover:bg-neutral-200 font-medium rounded-lg text-sm px-4 py-2 transition-all cursor-pointer"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {user ? (
        <MeProfile isOpen={modalType === 'profile'} onClose={closeModal} />
      ) : (
        <>
          <LoginForm
            isOpen={modalType === 'login'}
            onClose={closeModal}
            onSwitch={() => setModalType('register')}
          />
          <RegisterForm
            isOpen={modalType === 'register'}
            onClose={closeModal}
            onSwitch={() => setModalType('login')}
          />
        </>
      )}
    </header>
  );
};

export default Header;
