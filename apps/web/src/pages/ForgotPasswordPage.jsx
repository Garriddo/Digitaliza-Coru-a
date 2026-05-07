import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
      setIsSuccess(true);
      toast.success('Enlace de recuperación enviado');
    } catch (err) {
      console.error('Password reset error:', err);
      // Don't leak if email exists or not, always show generic success message in production
      // but for UX showing a generic toast is fine.
      toast.error('Si el correo existe, recibirás un enlace de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>Recuperar Contraseña - Digitaliza Coruña</title>
      </Helmet>

      <Link to="/login" className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a login
      </Link>

      <div className="auth-card">
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Revisa tu correo</h2>
            <p className="text-muted-foreground mb-8">
              Hemos enviado instrucciones a <strong>{email}</strong> para recuperar tu contraseña.
            </p>
            <Button asChild className="w-full h-12 bg-secondary text-white hover:bg-secondary/80">
              <Link to="/login">Volver a iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Recuperar acceso</h1>
              <p className="text-muted-foreground">Introduce tu correo para recibir un enlace de recuperación.</p>
            </div>

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

              <Button 
                type="submit" 
                disabled={isLoading || !email}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar enlace'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}