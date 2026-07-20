import { Routes, Route, BrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout'
import HomePage from '../pages/HomePage'
import ProvidersPage from '../pages/ProvidersPage';
import ProviderServicesPage from '../pages/ProviderServicesPage';
import ProviderSchedulesPage from '../pages/ProviderSchedulesPage';
import ServicesPage from '../pages/ServicesPage';
import ShiftsPage from '../pages/ShiftsPage';
import ShiftDetailPage from '../pages/ShiftDetailPage';
import ShiftCreatePage from '../pages/ShiftCreatePage';
import UsersDetailPage from '../pages/UsersDetailPage';
import UserCreatePage from '../pages/UserCreatePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta publica */}
        <Route path="/" element={<HomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="proveedores">
              <Route index element={<ProvidersPage />} />
              <Route path=":id/servicios" element={<ProviderServicesPage />} />
              <Route path=":id/horarios" element={<ProviderSchedulesPage />} />
            </Route>

            <Route path="servicios" element={<ServicesPage />} />

            <Route path="turnos">
              <Route index element={<ShiftsPage />} />
              <Route path=":id" element={<ShiftDetailPage />} />
              <Route path="nuevo" element={<ShiftCreatePage />} />
            </Route>

            <Route path="usuarios">
              <Route index element={<UsersDetailPage />} />
              <Route path="nuevo" element={<UserCreatePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;