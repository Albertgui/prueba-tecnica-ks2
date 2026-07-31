import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const InmueblesPage = lazy(() => import('@/pages/Inmuebles'));

// Placeholder Pages (To be built in the UI steps)
const UsuariosPage = () => <div className="p-8">Usuarios List (WIP)</div>;

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="animate-pulse">Cargando...</p></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/inmuebles" element={<InmueblesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
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
