import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BellRing,
  Bot,
  CalendarCheck,
  Check,
  ClipboardList,
  FileText,
  MessageCircle,
  PhoneCall,
  PhoneMissed,
  Repeat,
  SearchCheck,
  Sheet,
  Star,
  TimerReset,
  Users,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { SITE_CONFIG } from '@/config/siteConfig.js';

function HomePage() {
  const problems = [
    { icon: PhoneMissed, title: 'Llamadas perdidas', description: 'Cuando estás trabajando, cada llamada sin respuesta puede acabar en otro negocio.' },
    { icon: MessageCircle, title: 'WhatsApps acumulados', description: 'El cliente quiere una respuesta rápida. Si espera demasiado, se enfría.' },
    { icon: CalendarCheck, title: 'Citas mal gestionadas', description: 'El sistema filtra, pregunta lo necesario y deja las solicitudes ordenadas.' },
    { icon: ClipboardList, title: 'Presupuestos incompletos', description: 'Recoge matrícula, modelo, fotos y datos útiles antes de que pierdas tiempo.' },
    { icon: SearchCheck, title: 'Web poco convincente', description: 'Tu presencia online debe generar confianza antes de que el cliente te escriba.' },
    { icon: Repeat, title: 'Falta de seguimiento', description: 'Recordatorios y recuperación para clientes que ya confiaron en tu negocio.' },
  ];

  const steps = [
    'Analizamos cómo llegan tus clientes.',
    'Diseñamos el flujo de atención.',
    'Montamos web, WhatsApp, agenda y automatizaciones.',
    'Probamos contigo casos reales.',
    'Empiezas a recibir solicitudes ordenadas y citas mejor gestionadas.',
  ];

  const services = [
    { icon: FileText, title: 'Web profesional', description: 'Una web clara, rápida y preparada para convertir visitas en solicitudes.' },
    { icon: Bot, title: 'Bot WhatsApp 24/7', description: 'Responde, filtra y recoge datos aunque tú estés trabajando.' },
    { icon: CalendarCheck, title: 'Agenda automática', description: 'Conecta citas con Google Calendar y evita idas y vueltas.' },
    { icon: BellRing, title: 'Recordatorios', description: 'Avisos antes de la cita para reducir ausencias y despistes.' },
    { icon: Sheet, title: 'Google Sheets / CRM', description: 'Solicitudes ordenadas para revisar clientes, citas y presupuestos.' },
    { icon: PhoneCall, title: 'Agente de llamadas IA', description: 'Recepción telefónica IA para no depender solo de WhatsApp.' },
    { icon: TimerReset, title: 'Recuperación de clientes', description: 'Seguimiento automático para revisiones, mantenimiento y clientes dormidos.' },
    { icon: SearchCheck, title: 'Informes y seguimiento', description: 'Actividad mensual y mejoras basadas en lo que realmente ocurre.' },
  ];

  const sectors = [
    { title: 'Talleres mecánicos', description: 'Citas, presupuestos, urgencias, matrículas, recordatorios y seguimiento.', featured: true, icon: Wrench },
    { title: 'Peluquerías', description: 'Reservas, cambios de cita y consultas frecuentes.', icon: CalendarCheck },
    { title: 'Clínicas y estética', description: 'Solicitudes, recordatorios y filtrado inicial.', icon: Star },
    { title: 'Academias', description: 'Información, matrículas, horarios y seguimiento.', icon: Users },
    { title: 'Clubs deportivos', description: 'Altas, pruebas, clases y comunicaciones.', icon: BellRing },
    { title: 'Otros negocios locales', description: 'Cualquier negocio con citas, llamadas o WhatsApps.', icon: MessageCircle },
  ];

  return (
    <>
      <Helmet>
        <title>Digitaliza Coruña - Automatización para talleres y negocios locales</title>
        <meta
          name="description"
          content="Automatizamos WhatsApp, llamadas, citas y seguimiento para que talleres y negocios locales no pierdan clientes por falta de respuesta."
        />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <section className="relative w-full min-h-[calc(100dvh-80px)] flex items-center overflow-hidden bg-background">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1619642737579-a7474bee1044?auto=format&fit=crop&q=85&w=2200')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 px-3 py-1.5 rounded-md bg-white/8 border border-white/10 text-primary text-sm font-bold mb-6 text-left whitespace-normal">
              <Check className="w-4 h-4 shrink-0" /> <span className="min-w-0 break-words">Especialistas en talleres. Adaptable a negocios locales.</span>
            </div>
            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] text-balance">
              Tu taller atendiendo WhatsApp, llamadas y citas 24/7
            </h1>
            <p className="text-lg md:text-2xl text-white/82 mb-5 max-w-3xl leading-relaxed font-medium">
              Automatizamos la atención de negocios locales para que no pierdas clientes por llamadas sin responder, WhatsApps acumulados o citas mal gestionadas.
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-9 max-w-2xl leading-relaxed">
              Especialistas en talleres mecánicos. Adaptable a cualquier negocio local que recibe citas, consultas o solicitudes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-base md:text-lg px-7 py-6 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto">
                <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 hover:text-white text-base md:text-lg px-5 sm:px-7 py-6 font-bold bg-transparent w-full sm:w-auto whitespace-normal h-auto min-h-14">
                <Link to={SITE_CONFIG.CTA_LINKS.demos}>Ver cómo funcionaría en mi negocio</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/80">
              {['Sin compromiso', 'Revisión en menos de 15 minutos', 'Adaptado a tu forma de trabajar'].map((item) => (
                <span key={item} className="inline-flex max-w-full items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 whitespace-normal">
                  <Check className="w-4 h-4 text-primary shrink-0" /> <span>{item}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-14 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">Problemas que resolvemos</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              El problema no es trabajar más. Es dejar de perder oportunidades cuando estás atendiendo el negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="bg-card rounded-lg p-6 border border-white/10 hover:border-primary/45 transition-colors"
              >
                <div className="w-11 h-11 rounded-md bg-primary/12 flex items-center justify-center mb-5">
                  <problem.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">Cómo funciona</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Un proceso corto, claro y probado con casos reales antes de ponerlo a trabajar.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold">
                <Link to={SITE_CONFIG.CTA_LINKS.audit}>Quiero revisar mi caso</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="bg-card border border-white/10 rounded-lg p-5 md:p-6 flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center font-bold shrink-0">{index + 1}</div>
                  <p className="text-lg font-semibold text-white leading-snug pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-card/30 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">Servicios principales</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Piezas conectadas entre sí: web, WhatsApp, llamadas, agenda, datos y seguimiento.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <div key={service.title} className="bg-background border border-white/10 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <service.icon className="w-7 h-7 text-primary mb-5" />
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white">Soluciones por tipo de negocio</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Empezamos por talleres mecánicos porque el problema es claro: llamadas, WhatsApps, citas y presupuestos llegan mientras estás trabajando. Pero el sistema se adapta a cualquier negocio local que necesite atender solicitudes y organizar citas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {sectors.map((sector) => (
              <div
                key={sector.title}
                className={`rounded-lg border p-6 transition-colors ${
                  sector.featured
                    ? 'lg:col-span-2 bg-primary/10 border-primary/45 min-h-[220px]'
                    : 'bg-card border-white/10 hover:border-primary/35'
                }`}
              >
                <sector.icon className={`w-8 h-8 mb-5 ${sector.featured ? 'text-primary' : 'text-white/80'}`} />
                <h3 className={`font-bold text-white mb-3 ${sector.featured ? 'text-3xl' : 'text-xl'}`}>{sector.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1632823465306-cdbb200dd04a?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-12 mix-blend-multiply" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Revisa en 15 minutos dónde se te están escapando clientes
          </h2>
          <p className="text-xl mb-9 text-white/90 leading-relaxed font-medium mx-auto">
            Te digo qué automatizar primero, qué no merece la pena tocar y cómo encajaría en tu forma de trabajar.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-9 py-6 font-bold shadow-xl">
            <Link to={SITE_CONFIG.CTA_LINKS.audit}>Solicitar auditoría gratis</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
