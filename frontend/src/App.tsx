import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<AddUser />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/inmuebles" element={<InmuebleList />} />
            <Route path="/inmuebles/nuevo" element={<AddInmueble />} />
            <Route path="/inmuebles/:id" element={<InmuebleDetalle />} />
            <Route path="/inmuebles/:id/editar" element={<EditInmueble />} />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/" element={<Navigate to="/inmuebles" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;
