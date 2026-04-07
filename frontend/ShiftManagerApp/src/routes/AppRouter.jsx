import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PublicLayout from '../layouts/PublicLayout'
import ProjectPage from '../pages/ProjectPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/" replace />;
};


const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/docs" element={<ProjectPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;