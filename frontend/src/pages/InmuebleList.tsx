import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import type { Inmueble, PaginatedResponse } from '@/types';
import { InmuebleItem } from '@/components/inmuebles/InmuebleItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function InmuebleList() {
  const { logout, user } = useAuth();
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<string>('ALL');
  
  const [soloMios, setSoloMios] = useState(false);
  
  const endpoint = (() => {
    let base = `/inmuebles?page=${page}&limit=12`;
    if (estadoFilter !== 'ALL') base += `&estado=${estadoFilter}`;
    if (soloMios) base += `&soloMios=true`;
    return base;
  })();

  const { data, error, isLoading } = useSWR<PaginatedResponse<Inmueble>>(
    endpoint,
    fetcher
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Real Estate Pro</h1>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <Link to="/usuarios" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:flex items-center transition-colors">
              Directorio de Agentes
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Hola, {user?.nombre}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Catálogo de Inmuebles</h2>
            <Link to="/inmuebles/nuevo">
              <Button>Publicar Inmueble</Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant={soloMios ? "default" : "outline"}
              onClick={() => {
                setSoloMios(!soloMios);
                setPage(1);
              }}
            >
              Mis Inmuebles
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden lg:inline-block">Filtrar:</span>
            <Select 
              value={estadoFilter} 
              onValueChange={(val: string) => {
                setEstadoFilter(val);
                setPage(1); // Reset page on filter change
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                <SelectItem value="RESERVADO">Reservado</SelectItem>
                <SelectItem value="VENDIDO">Vendido</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-8 text-center bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error al cargar los inmuebles</h3>
            <p className="text-muted-foreground">Ocurrió un problema de conexión con el servidor. Por favor, intenta más tarde.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {/* EMPTY STATE */}
        {data && data.data.length === 0 && (
          <div className="p-12 text-center bg-muted/30 rounded-lg border border-dashed">
            <span className="text-5xl mb-4 block">🏡</span>
            <h3 className="text-xl font-semibold mb-2">No se encontraron inmuebles</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Actualmente no hay inmuebles disponibles en el catálogo. Vuelve a revisar más tarde.
            </p>
          </div>
        )}

        {/* DATA STATE */}
        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((inmueble) => (
                <InmuebleItem key={inmueble.id} inmueble={inmueble} />
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
