import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import type { Usuario } from '@/types';
import { UserItem } from '@/components/usuarios/UserItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Users, Frown } from 'lucide-react';

interface UsersResponse {
  data: Usuario[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsuariosPage() {
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR<UsersResponse>(
    `/usuarios?page=${page}&limit=12`,
    fetcher
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header backUrl="/inmuebles" backLabel="Volver a Inmuebles" />

      {}
      <div className="relative pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background opacity-20"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 shadow-lg shadow-black/50 border border-primary/20">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-background tracking-tight drop-shadow-lg mb-6 leading-tight">
            Directorio de Agentes.
          </h2>
          <p className="text-lg sm:text-xl text-background/80 mb-10 font-medium max-w-2xl mx-auto">
            Conoce a la red de profesionales inmobiliarios de mayor confianza. Listos para ayudarte a encontrar tu próximo hogar.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-12 relative z-20 max-w-6xl">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-64 w-full rounded-3xl" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-12 text-center bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto mt-12 shadow-sm">
            <Frown className="w-16 h-16 mx-auto text-destructive/50 mb-4" />
            <h3 className="text-2xl font-bold text-destructive mb-2">Error de Conexión</h3>
            <p className="text-muted-foreground text-lg mb-6">No pudimos conectar con el servidor para obtener el directorio. Por favor, intenta más tarde.</p>
            <Button className="rounded-full px-8 font-bold" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {data && data.data.length === 0 && !isLoading && (
          <div className="p-16 text-center bg-muted/20 rounded-3xl border border-dashed border-border/80 max-w-3xl mx-auto mt-12">
            <span className="text-6xl mb-6 block opacity-50">👥</span>
            <h3 className="text-2xl font-bold mb-3">No hay agentes</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
              Actualmente no hay otros usuarios registrados en el sistema. ¡Eres el único aquí!
            </p>
          </div>
        )}

        {data && data.data.length > 0 && !isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-8">
              {data.data.map((user) => (
                <UserItem key={user.id} user={user} />
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
      </main>
    </div>
  );
}
