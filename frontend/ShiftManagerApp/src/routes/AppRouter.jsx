import { useRef } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PublicLayout from '../layouts/PublicLayout'
import ProjectPage from '../pages/ProjectPage';
import { useAuth } from '../context/AuthContext';
import { Services } from '../context/ServicesContext';
import { MyShiftsProvider } from '../context/MyShiftsContext';
import { ProviderProvider } from '../context/ProviderContext'
import { ShiftsProvider } from '../context/ShiftsContext';

import ShiftsPage from '../pages/ShiftsPage';
import CreateShiftPage from '../pages/CreateShiftPage';

const ProtectedRoute = () => {
  const { user, loading, isManualLogout } = useAuth();
  const wasAuthenticated = useRef(!!user);

  // Mientras se verifica la session mostrar el Cargando...
  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando...</div>;
  }

  // Redireccionar si se cirra la sesion o no hay un usuario autenticado
  if (isManualLogout || (!user && !wasAuthenticated.current)) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
};

const ShiftsWrapper = () => {
  const { user } = useAuth();
  const isPersonalRole = user && ["Cliente", "Proveedor"].includes(user.roleActive);

  return isPersonalRole ? (
    <MyShiftsProvider><Outlet /></MyShiftsProvider>
  ) : (
    <ShiftsProvider><Outlet /></ShiftsProvider>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/docs" element={<ProjectPage />} />
          <Route path="/turnos" element={
            <Services>
              <ProviderProvider>
                <ShiftsWrapper />
              </ProviderProvider>
            </Services>
          } 
          >
            <Route index element={<ShiftsPage />} />
            
            <Route path="crear" element={<CreateShiftPage/>}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;