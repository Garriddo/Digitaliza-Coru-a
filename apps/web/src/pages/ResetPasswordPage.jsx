import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await pb.collection('users').confirmPasswordReset(token, formData.password, formData.confirmPassword, { $autoCancel: false });
      toast.success('Contraseña actualizada correctamente');
      navigate('/login');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('El enlace ha caducado o es inválido. Solicita uno nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center py-10">
          <h2 className="text-xl font-bold text-white mb-4">Enlace no válido</h2>
          <p className="text-muted-foreground mb-8">No se ha encontrado el token de recuperación.</p>
          <Button asChild className="bg-primary text-white">
            <Link to="/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Helmet>
        <title>Nueva Contraseña - Digitaliza Coruña</title>
      </Helmet>

      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Crear nueva contraseña</h1>
          <p className="text-muted-foreground">Introduce tu nueva contraseña segura.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="password">Nueva contraseña</label>
            <input 
              id="password"
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              className="form-input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input 
              id="confirmPassword"
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
              className="form-input-field"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Actualizar contraseña'}
          </Button>
        </form>
      </div>
    </div>
  );
}