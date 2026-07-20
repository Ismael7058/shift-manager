import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-slate-500">Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.idRol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
