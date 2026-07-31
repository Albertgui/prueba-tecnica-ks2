import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api, fetcher } from '@/services/api';
import type { Inmueble, TipoInmueble } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ArrowLeft } from 'lucide-react';

const inmuebleSchema = z.object({
  direccion: z.string().min(5, 'La dirección es muy corta'),
  precio: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  habitaciones: z.coerce.number().min(1, 'Debe tener al menos 1 habitación'),
  metrosCuadrados: z.coerce.number().min(1, 'Debe tener al menos 1 metro cuadrado'),
  tipoInmuebleId: z.string().uuid('Selecciona un tipo válido'),
});

type InmuebleFormValues = z.infer<typeof inmuebleSchema>;

export default function EditInmueble() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { data: tipos } = useSWR<TipoInmueble[]>('/tipos-inmueble', fetcher);
  const { data: inmueble, isLoading: isLoadingInmueble } = useSWR<Inmueble>(
    `/inmuebles/${id}`,
    fetcher
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InmuebleFormValues>({
    resolver: zodResolver(inmuebleSchema),
  });

  useEffect(() => {
    if (inmueble) {
      if (inmueble.vendedorId !== currentUser?.id) {
        navigate('/inmuebles');
        return;
      }
      if (inmueble.estado === 'VENDIDO') {
        navigate(`/inmuebles/${id}`);
        return;
      }

      reset({
        direccion: inmueble.direccion,
        precio: inmueble.precio,
        habitaciones: inmueble.habitaciones,
        metrosCuadrados: inmueble.metrosCuadrados,
        tipoInmuebleId: inmueble.tipoInmuebleId,
      });
    }
  }, [inmueble, currentUser, navigate, id, reset]);

  const onSubmit = async (data: InmuebleFormValues) => {
    try {
      setError(null);
      await api.patch(`/inmuebles/${id}`, data);
      navigate(`/inmuebles/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el inmueble');
    }
  };

  if (isLoadingInmueble) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (!inmueble) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Inmueble no encontrado</h2>
        <Button onClick={() => navigate('/inmuebles')} variant="outline">
          Volver al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-card mb-8">
        <div className="container mx-auto px-4 py-4">
          <Link to={`/inmuebles/${id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar edición
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border shadow-sm">
          <h1 className="text-3xl font-bold mb-2">Editar Inmueble</h1>
          <p className="text-muted-foreground mb-8">
            Modifica los detalles de tu publicación.
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
              <Button type="button" variant="outline" onClick={() => navigate(`/inmuebles/${id}`)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
