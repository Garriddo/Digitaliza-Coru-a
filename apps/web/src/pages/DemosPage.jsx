import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Bot, Calendar, CheckCircle2, Filter, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { SITE_CONFIG } from '@/config/siteConfig.js';

function DemosPage() {
  const cases = [
    {
      title: 'Cliente pide cita',
      description: 'El sistema entiende qué necesita, consulta disponibilidad, ofrece huecos y deja la cita preparada.',
      image: 'https://images.unsplash.com/photo-1619642737579-a7474bee1044?auto=format&fit=crop&q=80&w=1200',
      icon: Calendar,
      features: ['Consulta Google Calendar', 'Pregunta servicio y disponibilidad', 'Confirma y recuerda 24h antes'],
    },
    {
      title: 'Cliente pide presupuesto',
      description: 'Antes de interrumpirte, recopila datos útiles para que puedas responder con criterio.',
      image: 'https://images.unsplash.com/photo-1693289813090-f0974c9deb5b?auto=format&fit=crop&q=80&w=1200',
      icon: Filter,
      features: ['Pide marca, modelo y matrícula', 'Solicita fotos si hacen falta', 'Guarda un resumen ordenado'],
    },
    {
      title: 'Cliente tiene una urgencia',
      description: 'Cuando detecta una situación crítica, no la mete en la cola normal: te avisa para intervenir.',
      image: 'https://images.unsplash.com/photo-1664870314632-b546ed66f8a7?auto=format&fit=crop&q=80&w=1200',
      icon: AlertTriangle,
      features: ['Identifica señales de urgencia', 'Deriva a contacto manual', 'Prioriza sobre consultas rutinarias'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Demos - Digitaliza Coruña</title>
        <meta
          name="description"
          content="Prueba cómo un agente automatizado atiende citas, presupuestos y urgencias para talleres y negocios locales."
        />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <section className="py-20 md:py-28 bg-background relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
              <Bot className="w-4 h-4" /> Demo interactiva
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white text-balance">
              Mira cómo atendería solicitudes reales de tu negocio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium mx-auto">
              Citas, presupuestos y urgencias gestionadas con orden, sin que tengas que parar cada vez que llega un WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                El cliente escribe. El sistema agenda, filtra, recoge datos o deriva.
              </h2>
              <div className="space-y-4">
                {[
                  'Entiende si la persona quiere cita, presupuesto, información o ayuda urgente.',
                  'Hace preguntas útiles para no dejarte conversaciones a medias.',
                  'Te deja la información lista para actuar cuando realmente hace falta.',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-white/88 font-medium leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="bg-card border border-primary/25 rounded-lg p-7 md:p-9 shadow-2xl shadow-primary/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pruébalo ahora mismo</h3>
                    <p className="text-muted-foreground mx-auto">La demo actual se mantiene en Telegram para que puedas ver una conversación de prueba.</p>
                  </div>
                  <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg h-14 px-8 font-bold shadow-lg shadow-primary/20">
                    <a href="https://t.me/digitalizacorunabot" target="_blank" rel="noopener noreferrer">
                      <Send className="w-5 h-5 mr-2" />
                      Abrir demo en Telegram <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                  <p className="text-sm font-medium text-muted-foreground/80">Configurada como ejemplo para un taller mecánico.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {cases.map((item, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="relative rounded-lg overflow-hidden ring-1 ring-white/10 shadow-xl">
                  <img src={item.image} alt={item.title} className="w-full h-[280px] sm:h-[380px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                </div>
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{item.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/88 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5">Quiero ver esto aplicado a mi negocio</h2>
          <p className="text-xl text-muted-foreground mx-auto mb-8">
            Cuéntame cómo entran hoy tus solicitudes y te digo qué flujo tendría más sentido.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg h-14 px-9 font-bold shadow-lg shadow-primary/20">
            <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default DemosPage;
