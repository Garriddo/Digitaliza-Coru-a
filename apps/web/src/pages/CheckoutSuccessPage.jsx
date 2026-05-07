import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, MessageCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { formatCurrency } from '@/api/EcommerceApi.js';

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError('No se encontró información de la sesión.');
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve session details');
        }
        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('No pudimos recuperar los detalles de tu compra.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B00] mb-4" />
          <p className="text-muted-foreground font-medium">Verificando tu pago...</p>
        </div>
      );
    }

    if (error && !sessionData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Aviso sobre tu pedido</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            {error} Pero no te preocupes, si tu pago se completó, nos pondremos en contacto contigo pronto.
          </p>
          <Button asChild className="bg-[#0A2540] text-white">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      );
    }

    return (
      <>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg mb-6"
        >
          <CheckCircle2 className="w-20 h-20 text-[#FF6B00]" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] dark:text-white mb-4">
          ¡Pago completado con éxito!
        </h1>
        
        <p className="text-lg text-[#64748B] dark:text-slate-400 mb-8 max-w-lg">
          Gracias por confiar en Digitaliza Coruña. Hemos recibido tu pedido y nuestro equipo comenzará tu configuración en breve.
        </p>

        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-10 border border-slate-100 dark:border-slate-800 text-left">
          <h3 className="font-semibold text-lg text-[#0A2540] dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
            Resumen de Compra
          </h3>
          
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">ID de Sesión</span>
            <span className="font-medium text-foreground text-sm truncate max-w-[200px]" title={sessionData?.id}>
              {sessionData?.id || 'No disponible'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Total pagado (Setup)</span>
            <span className="font-bold text-foreground">
              {sessionData?.amountTotal ? formatCurrency(sessionData.amountTotal, { symbol: '€', code: 'EUR' }) : '---'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Email de contacto</span>
            <span className="text-foreground text-sm">
              {sessionData?.customerEmail || 'No disponible'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-muted-foreground">Estado del pedido</span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 uppercase tracking-wide">
              {sessionData?.status === 'complete' ? 'CONFIRMADO' : 'PROCESANDO'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            asChild
            size="lg"
            className="bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-semibold shadow-md"
          >
            <Link to="/">
              Volver a inicio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50 dark:hover:bg-orange-950/30"
          >
            <a href="https://wa.me/34600000000?text=Hola,%20acabo%20de%20comprar%20un%20paquete%20y%20me%20gustar%C3%ADa%20comenzar." target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Pago Completado - Digitaliza Coruña</title>
        <meta name="description" content="Tu pedido se ha completado con éxito. Gracias por confiar en Digitaliza Coruña." />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <main className="min-h-[75vh] bg-slate-50 dark:bg-slate-950 py-16 md:py-24 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-xl border-border/50 overflow-hidden bg-white dark:bg-slate-900 relative">
              <div className="bg-[#0A2540] h-32 w-full absolute top-0 left-0"></div>
              
              <CardContent className="pt-16 pb-12 px-6 sm:px-12 relative z-10 flex flex-col items-center text-center">
                {renderContent()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default CheckoutSuccessPage;