import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email) newErrors.email = 'El email es obligatorio';
    if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);

    try {
      // Create user record. The backend hook handles setting plan=null and estado='no_activo'
      await register(formData.email, formData.password, formData.name);
      
      toast.success('Cuenta creada exitosamente. Por favor, inicia sesión.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Error al crear la cuenta. Es posible que el email ya esté en uso.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error for field
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>Crear Cuenta - Digitaliza Coruña</title>
      </Helmet>

      <Link to="/" className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
      </Link>

      <div className="auth-card my-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Crear cuenta</h1>
          <p className="text-muted-foreground">El primer paso para digitalizar tu taller</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="name">Nombre del taller o responsable</label>
            <input 
              id="name"
              type="text" 
              value={formData.name}
              onChange={handleChange}
              className="form-input-field"
              placeholder="Taller Hermanos García"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="email">Correo electrónico</label>
            <input 
              id="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              className="form-input-field"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="password">Contraseña (Mín. 8 caracteres)</label>
            <input 
              id="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              className="form-input-field"
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              id="confirmPassword"
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input-field"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all active:scale-[0.98] mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Completar registro'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-white hover:text-primary transition-colors">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}