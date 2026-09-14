import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';

import HomePage from '../pages/HomePage';
import ClientsPage from '../pages/ClientsPage';
import ProvidersPage from '../pages/ProvidersPage';
import ProviderServicesPage from '../pages/ProviderServicesPage';
import ProviderSchedulesPage from '../pages/ProviderSchedulesPage';
import ServicesPage from '../pages/ServicesPage';
import ServiceUpdatePage from '../pages/ServiceUpdatePage';
import ShiftsPage from '../pages/ShiftsPage';
import ShiftCreatePage from '../pages/ShiftCreatePage';
import ShiftDetailPage from '../pages/ShiftDetailPage';
import UsersPage from '../pages/UsersPage';
import UserCreatePage from '../pages/UserCreatePage';
import UsersDetailPage from '../pages/UsersDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Recepcion']} />}>
              <Route path="clientes" element={<ClientsPage />} />
            </Route>

            <Route path="proveedores">
              <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Recepcion']} />}>
                <Route index element={<ProvidersPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                <Route path=":id/servicios" element={<ProviderServicesPage />} />
                <Route path=":id/horarios" element={<ProviderSchedulesPage />} />
              </Route>
            </Route>

            <Route path="servicios">
              <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Proveedor']} />}>
                <Route index element={user?.roleActive === 'Proveedor' ? <ProviderServicesPage /> : <ServicesPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                <Route path=":id" element={<ServiceUpdatePage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Proveedor']} />}>
              <Route path="horarios" element={<ProviderSchedulesPage />} />
            </Route>

            <Route path="turnos">
              <Route index element={<ShiftsPage />} />
              <Route path=":id" element={<ShiftDetailPage />} />
              <Route element={<ProtectedRoute allowedRoles={['Cliente', 'Administrador', 'Recepcion']} />}>
                <Route path="nuevo" element={<ShiftCreatePage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
              <Route path="usuarios">
                <Route index element={<UsersPage />} />
                <Route path="nuevo" element={<UserCreatePage />} />
                <Route path=":id" element={<UsersDetailPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;