import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher, api } from '@/services/api';
import type { Inmueble, EstadoInmueble } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Maximize, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function InmuebleDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const { data: inmueble, error, isLoading, mutate } = useSWR<Inmueble>(
    `/inmuebles/${id}`,
    fetcher
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingState, setIsChangingState] = useState(false);

  const isOwner = currentUser?.id === inmueble?.vendedorId;
  const isVendido = inmueble?.estado === 'VENDIDO';

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-green-500/10 text-green-500';
      case 'RESERVADO': return 'bg-yellow-500/10 text-yellow-500';
      case 'VENDIDO': return 'bg-slate-500/10 text-slate-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const handleEstadoChange = async (nuevoEstado: EstadoInmueble) => {
    try {
      setIsChangingState(true);
      await api.patch(`/inmuebles/${id}/estado`, { estado: nuevoEstado });
      mutate(); // Reload data
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cambiar estado');
    } finally {
      setIsChangingState(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este inmueble?')) return;
    try {
      setIsDeleting(true);
      await api.delete(`/inmuebles/${id}`);
      navigate('/inmuebles');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !inmueble) {
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
          <Link to="/inmuebles" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Header Image Placeholder */}
          <div className="h-64 sm:h-96 bg-muted relative flex items-center justify-center border-b">
            <span className="text-8xl opacity-10">🏠</span>
            <div className="absolute top-6 right-6">
              <Badge className={`text-lg px-4 py-1 ${getEstadoColor(inmueble.estado)}`}>
                {inmueble.estado}
              </Badge>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="uppercase tracking-wider">
                    {inmueble.tipoInmueble?.nombre || 'Inmueble'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Publicado el {new Date(inmueble.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold mb-4 tracking-tight">
                  ${inmueble.precio.toLocaleString()}
                </h1>
                
                <div className="flex items-center text-lg text-muted-foreground mb-8">
                  <MapPin className="w-5 h-5 mr-2 shrink-0" />
                  <span>{inmueble.direccion}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mb-12">
                  <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                    <Bed className="w-6 h-6 mr-3 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Habitaciones</p>
                      <p className="font-semibold">{inmueble.habitaciones}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                    <Maximize className="w-6 h-6 mr-3 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Área</p>
                      <p className="font-semibold">{inmueble.metrosCuadrados} m²</p>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">Información del Agente</h3>
                  <div className="flex items-center p-4 border rounded-lg bg-card">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{inmueble.vendedor?.nombre}</p>
                      <p className="text-muted-foreground">{inmueble.vendedor?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Panel (Only for owner) */}
              {isOwner && (
                <div className="w-full md:w-80 space-y-6">
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-semibold text-lg mb-4">Gestionar Inmueble</h3>
                    
                    {!isVendido ? (
                      <>
                        <div className="space-y-3 mb-6">
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => navigate(`/inmuebles/${inmueble.id}/editar`)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Editar Detalles
                          </Button>
                          <Button 
                            className="w-full text-destructive hover:bg-destructive/10" 
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar Inmueble
                          </Button>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-3">Cambiar Estado:</p>
                          <div className="space-y-2">
                            {inmueble.estado === 'DISPONIBLE' && (
                              <Button 
                                size="sm" 
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                onClick={() => handleEstadoChange('RESERVADO')}
                                disabled={isChangingState}
                              >
                                Marcar como Reservado
                              </Button>
                            )}
                            {inmueble.estado === 'RESERVADO' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleEstadoChange('DISPONIBLE')}
                                disabled={isChangingState}
                              >
                                Liberar (Hacer Disponible)
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                              onClick={() => {
                                if (confirm('¿Marcar como vendido? Esta acción es irreversible.')) {
                                  handleEstadoChange('VENDIDO');
                                }
                              }}
                              disabled={isChangingState}
                            >
                              Marcar como Vendido
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 bg-green-500/10 text-green-700 rounded-lg border border-green-200">
                        <p className="font-medium">Inmueble Vendido</p>
                        <p className="text-sm mt-1">Este inmueble ya no puede ser editado ni eliminado.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
