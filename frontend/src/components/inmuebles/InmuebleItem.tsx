import type { Inmueble } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Maximize, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  inmueble: Inmueble;
}

export function InmuebleItem({ inmueble }: Props) {
  const { user } = useAuth();
  const isOwner = user?.id === inmueble.vendedorId;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'RESERVADO':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'VENDIDO':
        return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="h-48 bg-muted relative overflow-hidden">
        {/* Placeholder for an image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
          <span className="text-4xl opacity-20">🏢</span>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className={`font-semibold ${getEstadoColor(inmueble.estado)}`}>
            {inmueble.estado}
          </Badge>
        </div>
      </div>
      
      {isOwner && (
        <div className="bg-primary text-primary-foreground text-xs py-1 px-3 text-center font-medium flex items-center justify-center">
          <User className="w-3 h-3 mr-1" /> Tu publicación
        </div>
      )}

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
      <div className="p-4 pt-0 border-t mt-4 flex items-center justify-between">
        <Link 
          to={`/inmuebles/${inmueble.id}`}
          className="text-primary hover:underline text-sm font-medium w-full text-center"
        >
          Ver Detalles
        </Link>
      </div>
    </Card>
  );
}
