import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.returnTo || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Sesión iniciada correctamente');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>Acceso clientes - Digitaliza Coruña</title>
      </Helmet>

      <Link to="/" className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
      </Link>

      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="auth-card border-white/10 rounded-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-md bg-primary/12 text-primary flex items-center justify-center mx-auto mb-5">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Acceso clientes</h1>
          <p className="text-muted-foreground">
            Panel privado para revisar tu sistema, datos del negocio, pagos y soporte.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input-field"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 gap-3">
              <label className="form-label mb-0" htmlFor="password">Contraseña</label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline text-right">
                ¿Has olvidado tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input-field"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-background"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
              Recordarme
            </label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all active:scale-[0.98]">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar al panel'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-white hover:text-primary transition-colors">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
