import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

interface HeaderProps {
  backUrl?: string;
  backLabel?: string;
}

export function Header({ backUrl, backLabel }: HeaderProps = {}) {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 glass border-b border-border/40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/inmuebles">
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              RealEstatePro.
            </h1>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          {backUrl ? (
            <Link to={backUrl} className="text-sm font-semibold text-muted-foreground hover:text-primary hidden sm:flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> {backLabel || 'Volver'}
            </Link>
          ) : (
            <Link to="/usuarios" className="text-sm font-semibold text-muted-foreground hover:text-primary hidden sm:flex items-center transition-colors">
              Directorio de Agentes
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                Hola, <span className="font-bold text-foreground">{user.nombre}</span>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full px-4"
              >
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="rounded-full px-6 font-bold">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
