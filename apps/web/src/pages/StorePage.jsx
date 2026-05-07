import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const packages = [
  {
    id: 'basico',
    name: 'Paquete Básico',
    price: '399€',
    monthly: '+ 29€/mes',
    description: 'Página web profesional optimizada para que tus clientes te encuentren en Google y confíen en tu negocio.',
    image: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800',
    features: [
      'Web profesional responsive',
      'Dominio y hosting incluido',
      'Catálogo con botón WhatsApp',
      'SEO local básico'
    ]
  },
  {
    id: 'pro',
    name: 'Paquete Pro',
    price: '849€',
    monthly: '+ 49€/mes',
    description: 'Sistema que automatiza citas, filtra clientes y evita que pierdas oportunidades.',
    image: 'https://images.unsplash.com/photo-1648134859211-4a1b57575f4e?auto=format&fit=crop&q=80&w=800',
    recommended: true,
    features: [
      'Todo lo del paquete Básico',
      'Bot WhatsApp Inteligente (24/7)',
      'Gestión de citas automática',
      'Recogida de datos de clientes'
    ]
  },
  {
    id: 'premium',
    name: 'Paquete Premium',
    price: '1.199€',
    monthly: '+ 89€/mes',
    description: 'Escala tu negocio con publicidad y ventas online sin depender del boca a boca.',
    image: 'https://images.unsplash.com/photo-1677693944335-178ba4f745d2?auto=format&fit=crop&q=80&w=800',
    features: [
      'Todo lo del paquete Pro',
      'Tienda online con pasarela',
      'Publicidad en Meta Ads',
      'CRM de clientes avanzado'
    ]
  }
];

function StorePage() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [processingId, setProcessingId] = useState(null);

  const handleCheckout = async (pkgId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: location.pathname, selectedPlan: pkgId } });
      return;
    }

    setProcessingId(pkgId);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: pkgId,
          user_id: currentUser.id,
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
      setProcessingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tienda - Digitaliza Coruña</title>
        <meta name="description" content="Elige el pack y nosotros nos encargamos de todo. Automatización y captación de clientes para tu taller." />
      </Helmet>

      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-balance text-white">
              Empieza a transformar tu taller hoy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 font-medium">
              Elige el pack y nosotros nos encargamos de todo
            </p>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-start gap-3 bg-card p-4 rounded-lg border border-border text-left w-full">
                <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Los precios corresponden al coste inicial del servicio. Cada plan incluye una cuota mensual para mantenimiento y soporte.
                </p>
              </div>
              <div className="flex justify-center">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 font-medium group">
                  <Link to="/services" className="flex items-center gap-2">
                    Ver más información sobre cada plan
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-24 bg-card/30 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const isPro = pkg.recommended;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={`flex flex-col h-full rounded-2xl bg-card overflow-hidden transition-all duration-300 relative ${
                    isPro 
                      ? 'border-2 border-primary ring-4 ring-primary/10 shadow-xl' 
                      : 'border border-border hover:border-primary/50'
                  }`}
                >
                  {isPro && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide uppercase z-20">
                      Recomendado
                    </div>
                  )}

                  {/* Card Image Header */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {pkg.name}
                      </h3>
                      <div className="flex items-baseline gap-2 text-white">
                        <span className="text-4xl font-black">{pkg.price}</span>
                        <span className="text-white/80 font-medium text-sm">{pkg.monthly}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    <div className="space-y-4 mb-8 flex-1">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 shrink-0 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium text-white">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mt-auto">
                      <Button 
                        onClick={() => handleCheckout(pkg.id)}
                        disabled={processingId === pkg.id}
                        className={`w-full font-bold h-14 text-base transition-all active:scale-[0.98] bg-primary hover:bg-primary/90 text-white`}
                      >
                        {processingId === pkg.id ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          'Pagar ahora'
                        )}
                      </Button>
                      <p className="text-xs text-center font-medium text-muted-foreground">
                        Acceso inmediato tras el pago
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default StorePage;