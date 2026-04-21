import { useRef } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PublicLayout from '../layouts/PublicLayout'
import ProjectPage from '../pages/ProjectPage';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../context/NotificationContext';
import { Services } from '../context/ServicesContext';
import ShiftsContent from '../context/ShiftsContext';


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


const AppRouter = () => {
  return (
    <Notification>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/docs" element={<ProjectPage />} />
            <Route 
              path="/turnos" 
              element={
                <Services>
                  <ShiftsContent />
                </Services>
              } 
            />
          </Route>
        </Route>
      </Routes>
    </Notification>
  );
};

export default AppRouter;