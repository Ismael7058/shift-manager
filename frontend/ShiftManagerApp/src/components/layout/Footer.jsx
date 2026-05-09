import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-neutral-950/50 backdrop-blur-md border-t border-white/10 py-8 px-4 lg:px-7">
      <div className="mx-auto w-full  p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link
              to='/'
              className="flex items-center text-2xl text-white font-bold tracking-tighter transition-all"
            >
              Shift
              <span className='text-white/30'>Manager</span>
            </Link>
            <p className="mt-4 text-sm text-white/60 max-w-xs">
              Optimiza tus horarios y gestiona tu equipo con eficiencia.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Compañía</h2>
              <ul className="text-white/60 font-medium space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Acerca de</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Carreras</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Recursos</h2>
              <ul className="text-white/60 font-medium space-y-2">
                <li>
                  <a href="/docs" className="hover:text-white transition-colors">Documentación API</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Soporte</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Tutoriales</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Legal</h2>
              <ul className="text-white/60 font-medium space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-white/10 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white/60 sm:text-center">
            © {new Date().getFullYear()} <a href="/" className="hover:underline">ShiftManager™</a>. Todos los derechos reservados.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            {/* Aquí puedes añadir iconos de redes sociales si lo deseas */}
            {/* Ejemplo de icono (requeriría un componente o SVG): */}
            {/* <a href="#" className="text-white/60 hover:text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Facebook page</span>
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer