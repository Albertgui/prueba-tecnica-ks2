import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Placeholder Pages (To be built in the UI steps)
const LoginPage = () => <div className="p-8">Login Page (WIP)</div>;
const RegisterPage = () => <div className="p-8">Register Page (WIP)</div>;
const InmueblesPage = () => <div className="p-8">Inmuebles Catalog (WIP)</div>;
const UsuariosPage = () => <div className="p-8">Usuarios List (WIP)</div>;

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
