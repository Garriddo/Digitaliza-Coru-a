import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [planData, setPlanData] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Error: No se encontró session_id en la URL');
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await apiServerClient.fetch('/stripe/confirm-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setPlanData(data.plan);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.message || data.error || 'Hubo un problema al confirmar el pago.');
        }
      } catch (err) {
        console.error('Error confirming payment:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Error de conexión al verificar el pago.');
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Confirmación de Pago - Digitaliza Coruña</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-xl w-full">
          {status === 'loading' && (
            <div className="bg-card rounded-2xl p-12 text-center border border-border shadow-2xl">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Confirmando tu pago...</h2>
              <p className="text-muted-foreground">Por favor, no cierres esta ventana. Estamos activando tu plan.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-card rounded-2xl p-12 text-center border border-destructive/20 shadow-2xl animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Problema con la verificación</h2>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-8 text-left">
                <p className="text-destructive font-medium text-center">{errorMessage}</p>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 w-full">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
              <div className="bg-primary/10 border-b border-primary/20 p-10 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/10">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Plan activado correctamente</h1>
                <p className="text-primary font-medium text-lg uppercase tracking-wide mt-2">Plan {planData}</p>
              </div>
              
              <div className="p-8 md:p-10 space-y-6">
                <p className="text-muted-foreground text-center mb-8">
                  Tu cuenta ha sido actualizada. Ya puedes acceder a todas las funcionalidades de tu plan.
                </p>

                <div className="pt-2">
                  <Button asChild className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                    <Link to="/dashboard">Ir a mi panel de control</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}