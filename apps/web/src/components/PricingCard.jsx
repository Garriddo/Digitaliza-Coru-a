import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Info, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

function PricingCard({ title, description, price, monthlyPrice, features, featured, monthlyNote, index, planId = 'basico' }) {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: location.pathname, selectedPlan: planId } });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
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
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`h-full flex ${featured ? 'lg:z-10' : 'z-0'}`}
    >
      <Card 
        className={`w-full flex flex-col relative transition-all duration-300 bg-[hsl(var(--pricing-bg))] ${
          featured 
            ? 'lg:scale-105 ring-2 ring-[hsl(var(--pricing-featured-ring))] border-[hsl(var(--pricing-featured-border))] shadow-2xl shadow-primary/10' 
            : 'hover:shadow-xl shadow-primary/5 border-[hsl(var(--pricing-border))]'
        }`}
      >
        {featured && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-accent text-accent-foreground text-xs md:text-sm font-extrabold tracking-widest uppercase py-1.5 px-4 rounded-full shadow-md">
              Recomendado para talleres
            </span>
          </div>
        )}
        
        <CardHeader className={`pt-8 ${featured ? 'pb-6' : 'pb-4'}`}>
          <CardTitle className="text-2xl md:text-3xl font-bold text-card-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-base mt-2 text-muted-foreground/90">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="mb-8 pb-8 border-b border-border/60">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">{price}</span>
            </div>
            {monthlyPrice && (
              <div className="text-lg font-semibold text-muted-foreground mt-2 flex items-center gap-2">
                <span className="text-accent">+</span> {monthlyPrice}
              </div>
            )}
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${featured ? 'text-accent' : 'text-primary/60'}`} />
                <span className="text-sm md:text-base leading-relaxed text-card-foreground/80 font-medium">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {monthlyNote && (
            <div className="mt-auto bg-muted/50 rounded-xl p-4 flex gap-3 items-start border border-border/40">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {monthlyNote}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-8">
          <Button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full transition-all duration-300 font-bold text-base h-14 ${
              featured 
                ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5'
            }`}
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default PricingCard;