import type { Usuario } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Calendar } from 'lucide-react';

interface Props {
  user: Usuario;
}

export function UserItem({ user }: Props) {

  const initials = user.nombre
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);


  const joinedDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="overflow-hidden group bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 relative">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-3xl group-hover:bg-primary/10 transition-colors duration-300"></div>
        <div className="absolute -bottom-6 -right-6 text-8xl opacity-10 font-black tracking-tighter mix-blend-overlay pointer-events-none">
          {initials}
        </div>
      </div>

      <CardContent className="p-6 pt-0 relative">
        <div className="flex flex-col items-center -mt-12 text-center">
          <Avatar className="h-24 w-24 border-4 border-card shadow-lg mb-4 group-hover:scale-105 transition-transform duration-300 relative z-10">
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-4 w-full">
            <div>
              <h3 className="font-bold text-xl leading-none tracking-tight mb-1">
                {user.nombre}
              </h3>
              <p className="text-sm font-medium text-primary">
                Agente Inmobiliario
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-muted/30 p-4 rounded-2xl border border-border/50 text-left">
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="truncate" title={user.email}>{user.email}</span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span>Desde {joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
