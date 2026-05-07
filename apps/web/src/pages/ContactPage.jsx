import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import ContactForm from '@/components/ContactForm.jsx';
import { SITE_CONFIG, whatsappUrl } from '@/config/siteConfig.js';

function ContactPage() {
  const contactInfo = [
    { icon: Phone, label: 'Teléfono', value: SITE_CONFIG.PHONE_NUMBER, link: SITE_CONFIG.PHONE_LINK },
    { icon: MessageCircle, label: 'WhatsApp', value: SITE_CONFIG.PHONE_NUMBER, link: whatsappUrl() },
    { icon: Mail, label: 'Email', value: SITE_CONFIG.EMAIL, link: `mailto:${SITE_CONFIG.EMAIL}` },
    { icon: MapPin, label: 'Ubicación', value: 'A Coruña, Galicia', link: null },
  ];

  return (
    <>
      <Helmet>
        <title>Contacto - Digitaliza Coruña</title>
        <meta
          name="description"
          content="Solicita una auditoría gratis para automatizar WhatsApp, llamadas, citas y seguimiento en tu taller o negocio local."
        />
      </Helmet>

      <Header />
      <WhatsAppButton />

      <section className="py-20 md:py-28 bg-background border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Solicita tu auditoría gratis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revisamos cómo llegan tus clientes, dónde se pierden oportunidades y qué automatización tendría más impacto.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Cuéntame qué necesitas</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                No hace falta que tengas claro el sistema. Basta con explicar qué te está pasando ahora: llamadas, WhatsApps, citas, presupuestos o seguimiento.
              </p>
              <ContactForm />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="bg-card rounded-lg border border-white/10 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Contacto directo</h2>
                <div className="space-y-5">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1 text-white">{info.label}</div>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-muted-foreground">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={whatsappUrl('Hola, quiero hablar sobre la auditoría gratis de Digitaliza Coruña.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white rounded-lg px-6 py-4 font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </a>

              <div className="bg-card/60 rounded-lg border border-white/10 p-6">
                <h3 className="font-bold text-white mb-2">Qué revisamos en la auditoría</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Cómo entran ahora las llamadas y WhatsApps.</li>
                  <li>Qué solicitudes se repiten más.</li>
                  <li>Qué flujo tendría sentido automatizar primero.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ContactPage;
