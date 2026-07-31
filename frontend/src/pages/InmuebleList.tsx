import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import type { Inmueble, PaginatedResponse } from '@/types';
import { InmuebleItem } from '@/components/inmuebles/InmuebleItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, PlusCircle, Building2, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export default function InmuebleList() {
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState<string>('ALL');
  const [soloMios, setSoloMios] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: '',
    precioMin: '',
    precioMax: '',
    habitaciones: ''
  });
  const [tipoFilter, setTipoFilter] = useState<string>('ALL');
  const [precioMin, setPrecioMin] = useState<string>('');
  const [precioMax, setPrecioMax] = useState<string>('');
  const [habitaciones, setHabitaciones] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({ search, precioMin, precioMax, habitaciones });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, precioMin, precioMax, habitaciones]);

  const { data: tipos } = useSWR<{ id: string, nombre: string }[]>('/tipos-inmueble', fetcher);

  const endpoint = (() => {
    let base = `/inmuebles?page=${page}&limit=12`;
    if (estadoFilter !== 'ALL') base += `&estado=${estadoFilter}`;
    if (soloMios) base += `&soloMios=true`;
    if (debouncedFilters.search) base += `&search=${encodeURIComponent(debouncedFilters.search)}`;
    if (tipoFilter !== 'ALL') base += `&tipoInmuebleId=${tipoFilter}`;
    if (debouncedFilters.precioMin) base += `&precioMin=${debouncedFilters.precioMin}`;
    if (debouncedFilters.precioMax) base += `&precioMax=${debouncedFilters.precioMax}`;
    if (debouncedFilters.habitaciones) base += `&habitaciones=${debouncedFilters.habitaciones}`;
    return base;
  })();

  const { data, error, isLoading } = useSWR<PaginatedResponse<Inmueble>>(
    endpoint,
    fetcher
  );

  const isPending = isLoading ||
    search !== debouncedFilters.search ||
    precioMin !== debouncedFilters.precioMin ||
    precioMax !== debouncedFilters.precioMax ||
    habitaciones !== debouncedFilters.habitaciones;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary pb-24">
      <Header />

      <main>
        {}
        <div className="relative pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background opacity-20"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-black text-background tracking-tight drop-shadow-lg mb-6 leading-tight">
            Encuentra el lugar perfecto para ti.
          </h2>
          <p className="text-lg sm:text-xl text-background/80 mb-10 font-medium max-w-2xl mx-auto">
            Explora cientos de propiedades exclusivas en nuestra red. Tu próximo hogar está a un clic de distancia.
          </p>

          {}
          <div className="bg-background/95 glass backdrop-blur-2xl p-2 sm:p-3 rounded-full shadow-2xl shadow-black/50 border border-white/10 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto w-full transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/20 focus-within:bg-background">
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Busca por ciudad, calle o barrio..."
                className="pl-12 w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-base sm:text-lg h-12 sm:h-14 font-medium"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-12 sm:h-14 rounded-full px-8 font-bold text-base shadow-lg hover:shadow-primary/25 transition-all"
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-4 relative z-20 -mt-8">
        <div className="bg-card glass border border-border/50 rounded-3xl p-4 sm:p-6 shadow-xl shadow-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <Button
              variant={soloMios ? "default" : "outline"}
              onClick={() => {
                setSoloMios(!soloMios);
                setPage(1);
              }}
              className="rounded-full px-6 font-semibold shrink-0"
            >
              <Building2 className="w-4 h-4 mr-2" /> Mis Publicaciones
            </Button>
            
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full px-6 font-semibold flex items-center gap-2 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros Avanzados
            </Button>
          </div>

          <Link to="/inmuebles/nuevo" className="w-full md:w-auto shrink-0">
            <Button className="w-full rounded-full px-8 font-bold bg-foreground text-background hover:bg-foreground/90 h-11">
              <PlusCircle className="w-5 h-5 mr-2" /> Publicar Inmueble
            </Button>
          </Link>
        </div>

        {}
        {showFilters && (
          <div className="mt-4 bg-card/80 glass backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg shadow-primary/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 fade-in-0 duration-300">
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Estado</label>
              <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setPage(1); }}>
                <SelectTrigger className="rounded-xl h-12 bg-background"><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="DISPONIBLE">Disponibles</SelectItem>
                  <SelectItem value="RESERVADO">Reservados</SelectItem>
                  <SelectItem value="VENDIDO">Vendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tipo</label>
              <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setPage(1); }}>
                <SelectTrigger className="rounded-xl h-12 bg-background"><SelectValue placeholder="Cualquiera" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">Cualquier tipo</SelectItem>
                  {tipos?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rango de Precio</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min $"
                  className="rounded-xl h-12 bg-background font-medium"
                  value={precioMin}
                  onChange={(e) => { setPrecioMin(e.target.value); setPage(1); }}
                />
                <span className="text-muted-foreground font-bold">-</span>
                <Input
                  type="number"
                  placeholder="Max $"
                  className="rounded-xl h-12 bg-background font-medium"
                  value={precioMax}
                  onChange={(e) => { setPrecioMax(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="space-y-3 flex flex-col justify-center px-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Habitaciones</label>
                <span className="text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{habitaciones ? `${habitaciones}+` : 'Cualquiera'}</span>
              </div>
              <div className="pt-2">
                <Slider
                  defaultValue={[0]}
                  max={8}
                  step={1}
                  className="cursor-pointer"
                  value={[parseInt(habitaciones || '0')]}
                  onValueChange={(value) => { 
                    setHabitaciones(value[0] === 0 ? '' : value[0].toString()); 
                    setPage(1); 
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="container mx-auto px-4 mt-12">
        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-60 w-full rounded-3xl" />
                <div className="space-y-3 px-2">
                  <Skeleton className="h-5 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-12 text-center bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto mt-12">
            <Frown className="w-16 h-16 mx-auto text-destructive/50 mb-4" />
            <h3 className="text-2xl font-bold text-destructive mb-2">Error de Conexión</h3>
            <p className="text-muted-foreground text-lg mb-6">No pudimos conectar con el servidor para obtener los inmuebles. Por favor, verifica tu red e intenta más tarde.</p>
            <Button className="rounded-full px-8 font-bold" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {data && data.data.length === 0 && !isPending && (
          <div className="p-16 text-center bg-muted/20 rounded-3xl border border-dashed border-border/80 max-w-3xl mx-auto mt-12">
            <span className="text-6xl mb-6 block opacity-50">🧭</span>
            <h3 className="text-2xl font-bold mb-3">No hay resultados</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
              No hemos encontrado inmuebles que coincidan con tus criterios de búsqueda actuales.
            </p>
            <Button variant="outline" className="rounded-full font-bold px-8" onClick={() => {
              setSearch('');
              setEstadoFilter('ALL');
              setTipoFilter('ALL');
              setPrecioMin('');
              setPrecioMax('');
              setHabitaciones('');
              setSoloMios(false);
            }}>
              Limpiar Búsqueda
            </Button>
          </div>
        )}

        {data && data.data.length > 0 && !isPending && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.data.map((inmueble) => (
                <InmuebleItem key={inmueble.id} inmueble={inmueble} />
              ))}
            </div>

            {}
            <div className="flex justify-center items-center mt-16 gap-2 bg-muted/30 w-fit mx-auto p-2 rounded-full border border-border/50 backdrop-blur-md">
              <Button
                variant="ghost"
                className="rounded-full font-bold px-6 hover:bg-background shadow-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm font-bold text-muted-foreground px-4">
                Página <span className="text-foreground">{data.meta.page}</span> de {data.meta.totalPages}
              </span>
              <Button
                variant="ghost"
                className="rounded-full font-bold px-6 hover:bg-background shadow-sm"
                disabled={page === data.meta.totalPages}
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </div>
      </main>
    </div>
  );
}
