import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';

export default function CheckoutFlow({ pkg, className }) {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          returnTo: location.pathname, 
          selectedPlan: pkg.id 
        }
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: pkg.id, // Passes 'basico', 'pro', or 'premium' to the backend
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/store'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar pago');
      }
      
      const data = await response.json();
      
      if (data && data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No se recibió URL de Stripe');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Hubo un error al conectar con la pasarela de pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isProcessing}
      className={className}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Procesando...
        </>
      ) : (
        'Pagar ahora'
      )}
    </Button>
  );
}