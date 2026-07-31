import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api, fetcher } from '@/services/api';
import type { TipoInmueble } from '@/types';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, DollarSign, Home, Bed, Maximize, Building2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const inmuebleSchema = z.object({
  direccion: z.string().min(5, 'La dirección es muy corta'),
  precio: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  habitaciones: z.coerce.number().min(1, 'Debe tener al menos 1 habitación'),
  metrosCuadrados: z.coerce.number().min(1, 'Debe tener al menos 1 metro cuadrado'),
  tipoInmuebleId: z.string().uuid('Selecciona un tipo válido'),
});

type InmuebleFormValues = z.infer<typeof inmuebleSchema>;

export default function AddInmueble() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: tipos } = useSWR<TipoInmueble[]>('/tipos-inmueble', fetcher);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InmuebleFormValues>({
    resolver: zodResolver(inmuebleSchema),
  });

  const onSubmit = async (data: InmuebleFormValues) => {
    try {
      setError(null);
      await api.post('/inmuebles', data);
      toast.success('Inmueble publicado con éxito');
      navigate('/inmuebles');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear el inmueble';
      setError(msg);
      toast.error(`No se pudo publicar: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header backUrl="/inmuebles" backLabel="Volver al catálogo" />

      <main className="container mx-auto px-4 mt-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 bg-gradient-to-br from-primary/10 via-background to-background p-8 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden">
            {}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase z-10">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Nuevo Listado
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight z-10">
              Publica tu propiedad de forma <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">sencilla.</span>
            </h1>
            <p className="text-lg text-muted-foreground z-10">
              Llega a miles de compradores y arrendatarios potenciales en minutos. Completa los detalles para destacar tu inmueble en el catálogo.
            </p>
            <div className="hidden lg:block mt-8 p-6 glass rounded-2xl border shadow-sm z-10">
              <h2 className="font-semibold text-foreground flex items-center mb-4">
                <Home className="w-4 h-4 mr-2 text-primary" /> Consejos para destacar
              </h2>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-start"><span className="text-primary mr-2">•</span> Sé preciso con los metros cuadrados para atraer a las personas correctas.</li>
                <li className="flex items-start"><span className="text-primary mr-2">•</span> Establece un precio competitivo tras revisar el mercado actual.</li>
                <li className="flex items-start"><span className="text-primary mr-2">•</span> La dirección exacta inspira mayor confianza en los clientes.</li>
              </ul>
            </div>
          </div>

          {}
          <div className="lg:col-span-7 bg-card p-6 sm:p-8 rounded-3xl border shadow-xl shadow-primary/5">
            <h2 className="text-2xl font-semibold mb-6">Detalles del Inmueble</h2>

            {error && (
              <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-start animate-in fade-in slide-in-from-top-2">
                <div className="mr-2 mt-0.5 font-bold">⚠️</div>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {}
              <div className="space-y-2 group">
                <label className="text-sm font-medium flex items-center text-foreground group-focus-within:text-primary transition-colors">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground group-focus-within:text-primary transition-colors" /> Dirección
                </label>
                <Input
                  className="h-12 bg-muted/40 hover:bg-muted/60 focus-visible:bg-transparent transition-all rounded-xl"
                  placeholder="Ej. Av. Siempre Viva 742, Springfield"
                  {...register('direccion')}
                />
                {errors.direccion && (
                  <p className="text-sm text-destructive font-medium animate-in fade-in">{errors.direccion.message}</p>
                )}
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center text-foreground group-focus-within:text-primary transition-colors">
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground group-focus-within:text-primary transition-colors" /> Tipo de Inmueble
                  </label>
                  <Controller
                    name="tipoInmuebleId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger aria-label="Seleccionar Tipo de Inmueble" className="h-12 bg-muted/40 hover:bg-muted/60 focus-visible:bg-transparent transition-all rounded-xl">
                          <SelectValue placeholder="Selecciona un tipo..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {tipos?.map((t) => (
                            <SelectItem key={t.id} value={t.id} className="rounded-lg cursor-pointer">
                              {t.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipoInmuebleId && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in">{errors.tipoInmuebleId.message}</p>
                  )}
                </div>

                {}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center text-foreground group-focus-within:text-primary transition-colors">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground group-focus-within:text-primary transition-colors" /> Precio ($)
                  </label>
                  <Input
                    className="h-12 bg-muted/40 hover:bg-muted/60 focus-visible:bg-transparent transition-all rounded-xl"
                    type="number"
                    placeholder="Ej. 150000"
                    {...register('precio')}
                  />
                  {errors.precio && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in">{errors.precio.message}</p>
                  )}
                </div>

                {}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center text-foreground group-focus-within:text-primary transition-colors">
                    <Bed className="w-4 h-4 mr-2 text-muted-foreground group-focus-within:text-primary transition-colors" /> Habitaciones
                  </label>
                  <Input
                    className="h-12 bg-muted/40 hover:bg-muted/60 focus-visible:bg-transparent transition-all rounded-xl"
                    type="number"
                    placeholder="Ej. 3"
                    {...register('habitaciones')}
                  />
                  {errors.habitaciones && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in">{errors.habitaciones.message}</p>
                  )}
                </div>

                {}
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center text-foreground group-focus-within:text-primary transition-colors">
                    <Maximize className="w-4 h-4 mr-2 text-muted-foreground group-focus-within:text-primary transition-colors" /> Área (m²)
                  </label>
                  <Input
                    className="h-12 bg-muted/40 hover:bg-muted/60 focus-visible:bg-transparent transition-all rounded-xl"
                    type="number"
                    placeholder="Ej. 120"
                    {...register('metrosCuadrados')}
                  />
                  {errors.metrosCuadrados && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in">{errors.metrosCuadrados.message}</p>
                  )}
                </div>

              </div>

              {}
              <div className="pt-8 mt-6 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="h-12 rounded-xl"
                  onClick={() => navigate('/inmuebles')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-12 rounded-xl px-8 bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-md hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Propiedad'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
