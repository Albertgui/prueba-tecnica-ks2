import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AddInmueble = lazy(() => import('@/pages/AddInmueble'));
const EditInmueble = lazy(() => import('@/pages/EditInmueble'));
const InmuebleDetalle = lazy(() => import('@/pages/InmuebleDetalle'));
const LoginPage = lazy(() => import('@/pages/Login'));
const AddUser = lazy(() => import('@/pages/AddUser'));
const InmuebleList = lazy(() => import('@/pages/InmuebleList'));
const UserList = lazy(() => import('@/pages/UserList'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="animate-pulse">Cargando...</p></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<AddUser />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/inmuebles" element={<InmuebleList />} />
            <Route path="/inmuebles/nuevo" element={<AddInmueble />} />
            <Route path="/inmuebles/:id" element={<InmuebleDetalle />} />
            <Route path="/inmuebles/:id/editar" element={<EditInmueble />} />
            <Route path="/usuarios" element={<UserList />} />
            {/* Default to inmuebles */}
            <Route path="/" element={<Navigate to="/inmuebles" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
