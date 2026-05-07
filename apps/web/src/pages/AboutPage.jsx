import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Handshake, MapPin, ShieldCheck, Target, Wrench, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { SITE_CONFIG } from '@/config/siteConfig.js';

function AboutPage() {
  const principles = [
    { icon: Target, title: 'Resultados antes que adornos', description: 'La web y los automatismos tienen que ayudarte a atender mejor y conseguir más solicitudes.' },
    { icon: Handshake, title: 'Tecnología sin complicarte', description: 'No se trata de llenar tu negocio de herramientas, sino de quitar fricción a tu día a día.' },
    { icon: ShieldCheck, title: 'Cercanía real', description: 'Un trato claro, local y directo. Sin venderte humo ni cosas que no necesitas.' },
  ];

  const advantages = [
    { icon: Zap, title: 'Implementación ágil', description: 'Primero lo importante: atención, citas y datos bien recogidos.' },
    { icon: Wrench, title: 'Pensado para talleres', description: 'El flujo contempla llamadas, matrículas, fotos, urgencias y presupuestos.' },
    { icon: MapPin, title: 'Mentalidad local', description: 'Negocios de A Coruña y Galicia que quieren modernizarse sin perder trato humano.' },
  ];

  return (
    <>
      <Helmet>
        <title>Sobre mí - Digitaliza Coruña</title>
        <meta
          name="description"
          content="Soy Alex, de Galicia, y ayudo a talleres y negocios locales a modernizar su atención sin complicarse con tecnología."
        />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <section className="py-20 md:py-28 bg-background border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 text-left whitespace-normal">
              <MapPin className="w-4 h-4 shrink-0" /> <span className="min-w-0 break-words">A Coruña · negocios locales · automatización práctica</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-7 leading-tight text-balance text-white">
              Soy Alex. Ayudo a negocios locales a atender mejor sin vivir pegados al móvil.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Digitaliza Coruña nace para ayudar a negocios locales a modernizar su atención sin complicarse con tecnología.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1662833595899-07c57d617f56?auto=format&fit=crop&q=80&w=1200"
                  alt="Trabajo profesional con automatizaciones para negocios locales"
                  className="w-full h-[360px] md:h-[560px] object-cover grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-7">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                No se trata de sustituir el trato humano
              </h2>
              <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Se trata de evitar que se pierdan clientes por no responder a tiempo. Una llamada sin coger, un WhatsApp que se queda abajo o una cita mal apuntada pueden acabar costando más que cualquier automatización.
                </p>
                <p>
                  Por eso Digitaliza Coruña se centra en sistemas sencillos: web profesional, WhatsApp, agenda, datos ordenados y seguimiento. Todo pensado para que el negocio siga sintiéndose tuyo.
                </p>
                <p>
                  Empezamos por talleres mecánicos porque el problema es muy claro, pero la misma lógica funciona en peluquerías, clínicas, academias, centros de estética, clubs deportivos y otros negocios locales.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white text-center">Mi forma de trabajar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {principles.map((item) => (
              <div key={item.title} className="p-6 md:p-8 bg-card rounded-lg border border-white/10">
                <item.icon className="w-8 h-8 text-primary mb-5" />
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {advantages.map((item) => (
              <div key={item.title} className="bg-background p-6 rounded-lg border border-white/10">
                <item.icon className="w-7 h-7 text-primary mb-5" />
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white text-balance">
            ¿Quieres ver cómo funcionaría esto en tu negocio?
          </h2>
          <p className="text-xl mb-10 text-muted-foreground leading-relaxed mx-auto">
            Te explico qué automatizaría primero y qué dejaría para más adelante.
          </p>
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-9 py-6 font-bold shadow-2xl shadow-primary/20">
            <Link to={SITE_CONFIG.CTA_LINKS.audit}>
              Solicitar auditoría gratis <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutPage;
