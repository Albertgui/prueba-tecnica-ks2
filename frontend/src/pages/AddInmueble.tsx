import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api, fetcher } from '@/services/api';
import type { TipoInmueble } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-card mb-8">
        <div className="container mx-auto px-4 py-4">
          <Link to="/inmuebles" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border shadow-sm">
          <h1 className="text-3xl font-bold mb-2">Publicar Inmueble</h1>
          <p className="text-muted-foreground mb-8">
            Ingresa los detalles del inmueble que deseas publicar en el catálogo.
          </p>

          {error && (
            <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input
                placeholder="Ej. Av. Siempre Viva 742"
                {...register('direccion')}
              />
              {errors.direccion && (
                <p className="text-sm text-destructive">{errors.direccion.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio ($)</label>
                <Input
                  type="number"
                  placeholder="Ej. 150000"
                  {...register('precio')}
                />
                {errors.precio && (
                  <p className="text-sm text-destructive">{errors.precio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Inmueble</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('tipoInmuebleId')}
                >
                  <option value="">Selecciona un tipo...</option>
                  {tipos?.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
                {errors.tipoInmuebleId && (
                  <p className="text-sm text-destructive">{errors.tipoInmuebleId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Habitaciones</label>
                <Input
                  type="number"
                  placeholder="Ej. 3"
                  {...register('habitaciones')}
                />
                {errors.habitaciones && (
                  <p className="text-sm text-destructive">{errors.habitaciones.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Metros Cuadrados</label>
                <Input
                  type="number"
                  placeholder="Ej. 120"
                  {...register('metrosCuadrados')}
                />
                {errors.metrosCuadrados && (
                  <p className="text-sm text-destructive">{errors.metrosCuadrados.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/inmuebles')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar Inmueble'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
