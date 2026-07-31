import type { Usuario } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Calendar } from 'lucide-react';

interface Props {
  user: Usuario;
}

export function UserCard({ user }: Props) {
  // Generate initials for avatar fallback
  const initials = user.nombre
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Format date
  const joinedDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/5 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              {user.nombre}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground pt-1">
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              <span>Agente desde {joinedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
