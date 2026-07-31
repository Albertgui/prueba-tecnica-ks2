import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres y ser segura'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AddUser() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', data);
      toast.success('¡Cuenta creada con éxito!', {
        description: 'Ahora puedes iniciar sesión con tus nuevas credenciales.'
      });
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear usuario';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background selection:bg-primary/20 selection:text-primary">
      {/* LADO IZQUIERDO: Branding (Oculto en móvil) */}
      <div className="hidden lg:flex w-1/2 bg-foreground relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-background opacity-20 z-0"></div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-background">
              RealEstatePro.
            </h1>
          </Link>
        </div>

        <div className="relative z-10 mb-12">
          <h2 className="text-5xl font-black text-background tracking-tight mb-6 leading-tight max-w-lg">
            Empieza a publicar tus inmuebles.
          </h2>
          <p className="text-xl text-background/70 font-medium max-w-md leading-relaxed">
            Únete a nuestra plataforma y conecta con miles de clientes potenciales buscando su próximo hogar. Es rápido, fácil y seguro.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 text-background/50 text-sm font-medium">
          <span>© 2026 RealEstatePro</span>
          <span>•</span>
          <span>Términos y Privacidad</span>
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Link>
        
        <div className="w-full max-w-md mx-auto space-y-8 mt-8 lg:mt-0">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Únete a la plataforma inmobiliaria líder del país.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nombre Completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej. Juan Pérez" 
                        className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="correo@ejemplo.com" 
                        className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="********" 
                          className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:bg-background transition-all pr-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">⚠️</div>
                  <div>{error}</div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/25 transition-all mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Registrarse'
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground pt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
