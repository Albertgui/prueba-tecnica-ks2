import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

import AddInmueble from '@/pages/AddInmueble';
import EditInmueble from '@/pages/EditInmueble';
import InmuebleDetalle from '@/pages/InmuebleDetalle';
import LoginPage from '@/pages/Login';
import AddUser from '@/pages/AddUser';
import InmuebleList from '@/pages/InmuebleList';
import UserList from '@/pages/UserList';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="realestate-theme">
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
    </ThemeProvider>
  );
}

export default App;
