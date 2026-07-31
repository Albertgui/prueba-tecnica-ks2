import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import type { Usuario } from '@/types';
import { UserItem } from '@/components/usuarios/UserItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface UsersResponse {
  data: Usuario[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsuariosPage() {
  const { logout, user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  
  const { data, error, isLoading } = useSWR<UsersResponse>(
    `/usuarios?page=${page}&limit=12`,
    fetcher
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Real Estate Pro</h1>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <Link to="/inmuebles" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Inmuebles
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Hola, {currentUser?.nombre}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Directorio de Agentes</h2>
            <p className="text-muted-foreground mt-1">Conoce a los profesionales registrados en la plataforma.</p>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-8 text-center bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error al cargar el directorio</h3>
            <p className="text-muted-foreground">Ocurrió un problema al obtener los agentes. Por favor, intenta más tarde.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {/* EMPTY STATE */}
        {data && data.data.length === 0 && (
          <div className="p-12 text-center bg-muted/30 rounded-lg border border-dashed">
            <span className="text-5xl mb-4 block">👥</span>
            <h3 className="text-xl font-semibold mb-2">No se encontraron agentes</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Actualmente no hay otros usuarios registrados en el sistema.
            </p>
          </div>
        )}

        {/* DATA STATE */}
        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center mt-12 gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {data.meta.page} de {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === data.meta.totalPages}
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
