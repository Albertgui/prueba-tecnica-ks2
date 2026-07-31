import React from 'react';
import type { Inmueble } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Maximize, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  inmueble: Inmueble;
}

export const InmuebleItem = React.memo(function InmuebleItem({ inmueble }: Props) {
  const { user } = useAuth();
  const isOwner = user?.id === inmueble.vendedorId;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'RESERVADO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'VENDIDO':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground';
    }
  };

  return (
    <Card className="overflow-hidden group card-hover-effect bg-card border-border">
      <div className="h-56 bg-muted relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <span className="text-5xl opacity-30 drop-shadow-md">🏢</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <Badge variant="secondary" className={`font-semibold glass shadow-sm ${getEstadoColor(inmueble.estado)}`}>
            {inmueble.estado}
          </Badge>
        </div>

        {isOwner && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-foreground text-background hover:bg-foreground border-transparent font-semibold shadow-md flex items-center px-3 py-1.5">
              <User className="w-3.5 h-3.5 mr-1.5" /> Tu publicación
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="line-clamp-1 text-xl font-bold">
            ${inmueble.precio.toLocaleString()}
          </CardTitle>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{inmueble.direccion}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{inmueble.habitaciones} Hab.</span>
          </div>
          <div className="flex items-center">
            <Maximize className="w-4 h-4 mr-1" />
            <span>{inmueble.metrosCuadrados} m²</span>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0 mt-4 flex items-center justify-between">
        <Link 
          to={`/inmuebles/${inmueble.id}`}
          className="w-full"
        >
          <button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-300">
            Ver Detalles
          </button>
        </Link>
      </div>
    </Card>
  );
});
