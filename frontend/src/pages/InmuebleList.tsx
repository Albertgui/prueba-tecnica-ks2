import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import type { Inmueble, PaginatedResponse } from '@/types';
import { InmuebleItem } from '@/components/inmuebles/InmuebleItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InmuebleList() {
  const { logout, user } = useAuth();
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<string>('ALL');
  const [soloMios, setSoloMios] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('ALL');
  const [precioMin, setPrecioMin] = useState<string>('');
  const [precioMax, setPrecioMax] = useState<string>('');
  const [habitaciones, setHabitaciones] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: tipos } = useSWR<{ id: string, nombre: string }[]>('/tipos-inmueble', fetcher);

  const endpoint = (() => {
    let base = `/inmuebles?page=${page}&limit=12`;
    if (estadoFilter !== 'ALL') base += `&estado=${estadoFilter}`;
    if (soloMios) base += `&soloMios=true`;
    if (debouncedSearch) base += `&search=${encodeURIComponent(debouncedSearch)}`;
    if (tipoFilter !== 'ALL') base += `&tipoInmuebleId=${tipoFilter}`;
    if (precioMin) base += `&precioMin=${precioMin}`;
    if (precioMax) base += `&precioMax=${precioMax}`;
    if (habitaciones) base += `&habitaciones=${habitaciones}`;
    return base;
  })();

  const { data, error, isLoading } = useSWR<PaginatedResponse<Inmueble>>(
    endpoint,
    fetcher
  );

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Real Estate Pro
            </h1>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <Link to="/usuarios" className="text-sm font-medium text-muted-foreground hover:text-primary hidden sm:flex items-center transition-colors">
              Directorio de Agentes
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Hola, <span className="font-semibold text-foreground">{user?.nombre}</span>
            </span>
            <Button variant="outline" size="sm" onClick={logout} className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div className="shrink-0">
            <h2 className="text-3xl font-bold tracking-tight whitespace-nowrap">Catálogo de Inmuebles</h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full xl:w-auto xl:justify-end">
            <div className="relative w-full md:w-80 lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por dirección..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/inmuebles/nuevo">
                <Button>Publicar Inmueble</Button>
              </Link>
              <Button
                variant={soloMios ? "default" : "outline"}
                onClick={() => {
                  setSoloMios(!soloMios);
                  setPage(1);
                }}
              >
                Mis Inmuebles
              </Button>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filtros
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-muted/30 border rounded-xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 fade-in-0 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Estado</label>
              <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Cualquiera</SelectItem>
                  <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                  <SelectItem value="RESERVADO">Reservado</SelectItem>
                  <SelectItem value="VENDIDO">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tipo de Inmueble</label>
              <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Cualquiera</SelectItem>
                  {tipos?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Rango de Precio</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={precioMin}
                  onChange={(e) => { setPrecioMin(e.target.value); setPage(1); }}
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={precioMax}
                  onChange={(e) => { setPrecioMax(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Habitaciones (Exacto)</label>
              <Input
                type="number"
                placeholder="Ej. 3"
                value={habitaciones}
                onChange={(e) => { setHabitaciones(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        )}

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

        {error && (
          <div className="p-8 text-center bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error al cargar los inmuebles</h3>
            <p className="text-muted-foreground">Ocurrió un problema de conexión con el servidor. Por favor, intenta más tarde.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="p-12 text-center bg-muted/30 rounded-lg border border-dashed">
            <span className="text-5xl mb-4 block">🏡</span>
            <h3 className="text-xl font-semibold mb-2">No se encontraron inmuebles</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Actualmente no hay inmuebles disponibles en el catálogo. Vuelve a revisar más tarde.
            </p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((inmueble) => (
                <InmuebleItem key={inmueble.id} inmueble={inmueble} />
              ))}
            </div>

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
