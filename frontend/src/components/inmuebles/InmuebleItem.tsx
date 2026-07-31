import React from 'react';
import type { Inmueble } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Maximize, User, CheckCircle2, ShieldAlert, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  inmueble: Inmueble;
}

export const InmuebleItem = React.memo(function InmuebleItem({ inmueble }: Props) {
  const { user } = useAuth();
  const isOwner = user?.id === inmueble.vendedorId;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 border-transparent px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Disponible</Badge>;
      case 'RESERVADO':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 border-transparent px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><ShieldAlert className="w-3 h-3 mr-1.5" /> Reservado</Badge>;
      case 'VENDIDO':
        return <Badge className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 border-transparent px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-sm backdrop-blur-md"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Vendido</Badge>;
      default:
        return <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground hover:bg-primary/20 border-transparent px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-sm backdrop-blur-md">{estado}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden group bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      <div className="h-60 bg-muted relative overflow-hidden shrink-0">
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
          <span className="text-6xl opacity-30 drop-shadow-md">🏢</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/20 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          {getEstadoBadge(inmueble.estado)}
        </div>

        {isOwner && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-background/90 text-foreground backdrop-blur-md hover:bg-background border-transparent font-bold shadow-lg flex items-center px-3 py-1.5 rounded-full">
              <User className="w-3.5 h-3.5 mr-1.5 text-primary" /> Tu publicación
            </Badge>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-1">
            ${inmueble.precio.toLocaleString()}
          </h3>
        </div>
      </div>
      
      <CardHeader className="pt-5 pb-2 px-5">
        <div className="flex items-start text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-1.5 shrink-0 mt-0.5 text-primary" />
          <span className="line-clamp-2 leading-tight">{inmueble.direccion}</span>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-5 mt-auto">
        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-2xl mb-4 border border-border/50">
          <div className="flex items-center font-medium">
            <Bed className="w-4 h-4 mr-1.5 text-primary/70" />
            <span>{inmueble.habitaciones} <span className="hidden sm:inline">Hab.</span></span>
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center font-medium">
            <Maximize className="w-4 h-4 mr-1.5 text-primary/70" />
            <span>{inmueble.metrosCuadrados} m²</span>
          </div>
        </div>

        <Link to={`/inmuebles/${inmueble.id}`} className="block">
          <div className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 group/btn">
            Ver Detalles
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
});
