import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PublicLayout from '../layouts/PublicLayout'
import ProjectPage from '../pages/ProjectPage';
import ShiftsPage from '../pages/ShiftsPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Si está verificando la sesión, mostramos un estado de carga 
  // para evitar la redirección prematura al "/"
  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};


const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/docs" element={<ProjectPage />} />
          <Route path="/turnos" element={<ShiftsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;