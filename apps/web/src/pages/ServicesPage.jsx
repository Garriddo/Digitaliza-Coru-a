import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Check, Globe, Headphones, MessageCircle, PhoneCall, ShieldCheck, Star, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { PACK_PRICES, SITE_CONFIG } from '@/config/siteConfig.js';

function ServicesPage() {
  const packages = [
    {
      id: 'basico',
      name: 'Básico',
      label: 'Presencia online profesional',
      price: PACK_PRICES.basico.setup,
      suffix: `pago único + ${PACK_PRICES.basico.monthly}`,
      description: 'Para negocios que necesitan una base seria: web, Google y contacto directo por WhatsApp.',
      icon: Globe,
      features: [
        'Web profesional responsive',
        'Dominio y hosting incluido',
        'SEO local básico',
        'Ficha Google My Business',
        'Botón WhatsApp directo',
        'Mantenimiento técnico web',
        'Copias de seguridad',
        'Soporte básico',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      label: 'WhatsApp + citas + automatización',
      price: PACK_PRICES.pro.setup,
      suffix: `pago único + ${PACK_PRICES.pro.monthly}`,
      description: 'La mejor opción para empezar a ordenar solicitudes, citas y presupuestos sin depender del móvil.',
      icon: MessageCircle,
      recommended: true,
      features: [
        'Todo lo del Básico',
        'Bot WhatsApp completo 24/7',
        'Agenda automática Google Calendar',
        'Recogida de datos en Google Sheets/CRM',
        'Rutas inteligentes cita/presupuesto/manual',
        'Recordatorio automático 24h antes de cita',
        'Encuesta de satisfacción post-visita básica',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      label: 'Sistema completo con llamadas IA',
      price: PACK_PRICES.premium.setup,
      suffix: `pago único + ${PACK_PRICES.premium.monthly}`,
      description: 'Cubre WhatsApp, llamadas y recuperación de clientes antiguos con una recepcionista telefónica IA.',
      icon: PhoneCall,
      premium: true,
      features: [
        'Todo lo del Pro',
        'Agente de llamadas IA / recepcionista telefónica IA',
        'Recuperación automática de clientes perdidos',
        'Recordatorios de mantenimiento preventivo',
        'Captación de email del cliente',
        'Email marketing mensual automatizado',
        'Respuestas automáticas a reseñas Google',
        'Informe mensual de actividad',
        'Soporte prioritario 24-48h',
      ],
    },
  ];

  const monthly = [
    {
      title: 'Base técnica siempre activa',
      description: 'Hosting, dominio, copias, mantenimiento y pequeños ajustes para que la web siga funcionando bien.',
      icon: ShieldCheck,
    },
    {
      title: 'Automatizaciones cuidadas',
      description: 'Revisión del bot, agenda, formularios y flujos para que el sistema responda como necesita tu negocio.',
      icon: Bot,
    },
    {
      title: 'Soporte y seguimiento',
      description: 'Ayuda cuando algo cambia, informe de actividad en planes superiores y mejoras según el uso real.',
      icon: Headphones,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Servicios y precios - Digitaliza Coruña</title>
        <meta
          name="description"
          content="Packs de automatización para talleres y negocios locales: web profesional, WhatsApp 24/7, agenda automática y agente de llamadas IA."
        />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <section className="py-20 md:py-28 bg-background border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/25 text-primary text-sm font-bold mb-6 text-left whitespace-normal">
              <Wrench className="w-4 h-4 shrink-0" /> <span className="min-w-0 break-words">Packs claros para empezar sin complicarte</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-balance leading-tight text-white">
              Servicios y precios para no perder más clientes
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Elige una base web, un sistema de WhatsApp y citas, o una atención completa que también cubre llamadas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col rounded-lg overflow-hidden bg-card border transition-all ${
                    pkg.recommended
                      ? 'border-primary ring-4 ring-primary/12 shadow-2xl shadow-primary/15 xl:-translate-y-4'
                      : pkg.premium
                        ? 'border-white/20 shadow-xl'
                        : 'border-white/10 hover:border-primary/35'
                  }`}
                >
                  {pkg.recommended && (
                    <div className="bg-primary text-white text-xs font-bold py-2 text-center tracking-wide uppercase flex items-center justify-center gap-2">
                      <Star className="w-3.5 h-3.5 fill-current" /> Recomendado para empezar
                    </div>
                  )}

                  {pkg.premium && (
                    <div className="bg-white/8 text-white text-xs font-bold py-2 text-center tracking-wide uppercase flex items-center justify-center gap-2 border-b border-white/10">
                      <PhoneCall className="w-3.5 h-3.5 text-primary" /> Agente de llamadas IA incluido
                    </div>
                  )}

                  <div className={`p-7 md:p-8 border-b border-white/10 ${pkg.premium ? 'bg-primary/8' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-7">
                      <div>
                        <h3 className="text-2xl font-extrabold text-white">{pkg.name}</h3>
                        <p className="text-sm font-semibold text-primary mt-1">{pkg.label}</p>
                      </div>
                      <div className="w-12 h-12 rounded-md bg-primary/12 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <span className="text-4xl font-extrabold text-white">{pkg.price}</span>
                      <span className="block text-sm font-medium text-muted-foreground mt-1">{pkg.suffix}</span>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 flex flex-col flex-1">
                    <p className="text-muted-foreground leading-relaxed mb-7">{pkg.description}</p>
                    <div className="space-y-3.5 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.recommended || pkg.premium ? 'text-primary' : 'text-white/60'}`} />
                          <span className="text-sm font-medium text-white/86 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-13 py-6 text-base">
                      <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Qué incluye la cuota mensual</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              No pagas solo por “tener algo online”. Pagas para que el sistema siga vivo, cuidado y útil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {monthly.map((item) => (
              <div key={item.title} className="bg-card border border-white/10 rounded-lg p-6">
                <item.icon className="w-8 h-8 text-primary mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-primary/25 bg-primary/8 p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro es la entrada más equilibrada. Premium cubre también el teléfono.</h3>
              <p className="text-muted-foreground leading-relaxed">
                Si tu principal fuga está en WhatsApp y agenda, empieza por Pro. Si además pierdes llamadas o quieres recuperar clientes antiguos, Premium tiene sentido.
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold shrink-0">
              <Link to={SITE_CONFIG.CTA_LINKS.audit}>Consultar mi caso</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ServicesPage;
