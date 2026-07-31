import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher, api } from '@/services/api';
import type { Inmueble, EstadoInmueble } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Bed, Maximize, User, Edit, Trash2, Calendar, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function InmuebleDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: inmueble, error, isLoading, mutate } = useSWR<Inmueble>(
    `/inmuebles/${id}`,
    fetcher
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingState, setIsChangingState] = useState(false);

  const isOwner = currentUser?.id === inmueble?.vendedorId;
  const isVendido = inmueble?.estado === 'VENDIDO';

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 border-transparent px-4 py-1.5 text-sm uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Disponible</Badge>;
      case 'RESERVADO':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 border-transparent px-4 py-1.5 text-sm uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><ShieldAlert className="w-4 h-4 mr-1.5" /> Reservado</Badge>;
      case 'VENDIDO':
        return <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 border-transparent px-4 py-1.5 text-sm uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Vendido</Badge>;
      default:
        return <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground hover:bg-primary/20 border-transparent px-4 py-1.5 text-sm uppercase tracking-wider font-bold shadow-sm backdrop-blur-md">{estado}</Badge>;
    }
  };

  const handleEstadoChange = async (nuevoEstado: EstadoInmueble) => {
    try {
      setIsChangingState(true);
      await api.patch(`/inmuebles/${id}/estado`, { estado: nuevoEstado });
      mutate();
      toast.success(`Estado actualizado a ${nuevoEstado}`);
    } catch (error: any) {
      const backendMessage = error.response?.data?.message || error.message || 'Error al cambiar estado';
      toast.error(`No se pudo cambiar el estado: ${backendMessage}`);
    } finally {
      setIsChangingState(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/inmuebles/${id}`);
      toast.success('Inmueble eliminado correctamente');
      navigate('/inmuebles');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error al eliminar');
      } else {
        toast.error('Error al eliminar');
      }
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header backUrl="/inmuebles" backLabel="Volver al catálogo" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !inmueble) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Inmueble no encontrado</h2>
        <p className="text-muted-foreground mb-8 max-w-md">La propiedad que estás buscando no existe o ha sido eliminada del catálogo.</p>
        <Button onClick={() => navigate('/inmuebles')} className="rounded-xl px-8 h-12">
          Volver al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header backUrl="/inmuebles" backLabel="Volver al catálogo" />

      <main className="pb-24">
        { }
        <div className="relative pt-12 pb-32 sm:pt-20 sm:pb-40 overflow-hidden bg-foreground">
          { }
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-background opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container relative z-10 mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  {getEstadoBadge(inmueble.estado)}
                  <Badge variant="outline" className="border-primary/30 text-primary-foreground bg-primary/10 px-3 py-1 text-xs">
                    {inmueble.tipoInmueble?.nombre || 'Inmueble'}
                  </Badge>
                  <span className="text-sm font-medium text-background/90 flex items-center bg-background/10 backdrop-blur px-3 py-1 rounded-full border border-border/10">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {new Date(inmueble.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-background tracking-tight drop-shadow-lg">
                  ${inmueble.precio.toLocaleString()}
                </h1>

                <div className="flex items-center text-lg sm:text-xl text-background/80 font-medium">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 shrink-0 text-background/80" />
                  <span className="leading-snug">{inmueble.direccion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        { }
        <div className="container mx-auto px-4 max-w-5xl relative z-20 -mt-16 sm:-mt-20">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            { }
            <div className="md:col-span-8 space-y-8">

              { }
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/80 glass backdrop-blur-xl border border-border/50 p-6 rounded-3xl shadow-xl shadow-primary/5 flex flex-col items-center sm:items-start text-center sm:text-left transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Bed className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Habitaciones</p>
                  <p className="text-2xl font-bold text-foreground">{inmueble.habitaciones}</p>
                </div>
                <div className="bg-card/80 glass backdrop-blur-xl border border-border/50 p-6 rounded-3xl shadow-xl shadow-primary/5 flex flex-col items-center sm:items-start text-center sm:text-left transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Maximize className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Área Total</p>
                  <p className="text-2xl font-bold text-foreground">{inmueble.metrosCuadrados} <span className="text-lg font-medium text-muted-foreground">m²</span></p>
                </div>
              </div>

            </div>

            { }
            <div className="md:col-span-4 space-y-6">

              { }
              <div className="bg-card border-2 border-transparent rounded-3xl p-6 shadow-xl shadow-primary/5">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" /> Agente Asignado
                </h2>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-4 border-background shadow-md">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div className="w-full space-y-1">
                    <p className="text-xl font-bold text-foreground">{inmueble.vendedor?.nombre}</p>
                    <p className="text-sm text-muted-foreground truncate">{inmueble.vendedor?.email}</p>
                  </div>
                </div>
              </div>

              { }
              {isOwner && (
                <div className="bg-card border-2 border-primary/10 rounded-3xl p-6 shadow-xl shadow-primary/5 mt-6">
                  <h2 className="font-bold text-lg mb-2 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-primary" /> Panel de Propietario
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">Gestiona la disponibilidad y los detalles de tu publicación.</p>

                  {!isVendido ? (
                    <div className="space-y-6">

                      { }
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Actualizar Estado</p>

                        {inmueble.estado === 'DISPONIBLE' && (
                          <Button
                            className="w-full h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-md hover:shadow-lg transition-all font-bold"
                            onClick={() => handleEstadoChange('RESERVADO')}
                            disabled={isChangingState}
                          >
                            Marcar como Reservado
                          </Button>
                        )}

                        {inmueble.estado === 'RESERVADO' && (
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-yellow-600/50 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 font-bold"
                            onClick={() => handleEstadoChange('DISPONIBLE')}
                            disabled={isChangingState}
                          >
                            Volver a Disponible
                          </Button>
                        )}

                        {inmueble.estado === 'RESERVADO' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-md transition-all"
                                disabled={isChangingState}
                              >
                                Marcar como Vendido
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-primary/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">¿Marcar como vendido?</AlertDialogTitle>
                                <AlertDialogDescription className="text-base">
                                  Esta acción ocultará el inmueble y no podrá ser revertida ni editada posteriormente. ¡Felicidades por la venta!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="rounded-xl h-12">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleEstadoChange('VENDIDO')} className="rounded-xl h-12 bg-primary hover:bg-primary/90">
                                  Confirmar Venta
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>

                      <div className="h-px w-full bg-border/60"></div>

                      { }
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Acciones</p>
                        <Button
                          className="w-full h-12 rounded-xl"
                          variant="outline"
                          onClick={() => navigate(`/inmuebles/${inmueble.id}/editar`)}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Editar Detalles
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="w-full h-12 rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 transition-all"
                              variant="outline"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Eliminar Inmueble
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-destructive/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl text-destructive flex items-center">
                                <ShieldAlert className="w-6 h-6 mr-2" />
                                ¿Estás absolutamente seguro?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la publicación de la base de datos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="rounded-xl h-12">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="rounded-xl h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                Sí, Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center p-6 bg-green-500/10 text-green-700 dark:text-green-400 rounded-2xl border border-green-200 dark:border-green-900/50">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-lg mb-1">¡Inmueble Vendido!</p>
                      <p className="text-sm opacity-90">Este inmueble ya no puede ser editado ni eliminado.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
