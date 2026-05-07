import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import CaseCard from '@/components/CaseCard.jsx';
import { motion } from 'framer-motion';

function CasesPage() {
  const cases = [
    {
      title: 'Taller Mecánico Multimarca en A Coruña',
      description: 'Bot de citas automáticas + catálogo de aceites Liqui Moly',
      image: 'https://images.unsplash.com/photo-1664870314632-b546ed66f8a7',
      testimonial: 'Ahora atendemos clientes incluso cuando estamos cerrados. El bot cualifica las citas y el catálogo de aceites nos genera ventas extra cada semana.',
      author: 'Carlos M., propietario',
      results: [
        'Aumento del 43% en citas mensuales',
        'Ventas de productos +28% primer trimestre',
        'Reducción de llamadas perdidas del 87%'
      ]
    },
    {
      title: 'Chapa y Pintura en el Polígono',
      description: 'Web profesional + optimización Google My Business',
      image: 'https://images.unsplash.com/photo-1655198739370-92b21627ca8e',
      testimonial: 'Antes no aparecíamos en Google. Ahora somos de los primeros resultados cuando buscan chapa y pintura en A Coruña.',
      author: 'Miguel R., gerente',
      results: [
        'Primera página de Google en 6 semanas',
        'Aumento del 56% en llamadas de nuevos clientes',
        'Mejora de reputación online con reseñas gestionadas'
      ]
    },
    {
      title: 'Neumáticos y Alineación',
      description: 'Catálogo de productos + WhatsApp automatizado',
      image: 'https://images.unsplash.com/photo-1675034743372-672c3c3f8377',
      testimonial: 'Los clientes ahora pueden ver precios de neumáticos online y pedir presupuestos por WhatsApp automáticamente. Nos ahorra mucho tiempo.',
      author: 'Laura P., responsable comercial',
      results: [
        'Presupuestos automáticos 24/7',
        'Incremento del 34% en ventas de neumáticos',
        'Tiempo de respuesta reducido de horas a minutos'
      ]
    },
    {
      title: 'Peluquería en Centro de A Coruña',
      description: 'Sistema de citas online + recordatorios automáticos',
      image: 'https://images.unsplash.com/photo-1592632471766-b082b3fba785',
      testimonial: 'Las clientas reservan citas desde el móvil a cualquier hora. Los recordatorios automáticos redujeron las ausencias casi a cero.',
      author: 'Ana S., propietaria',
      results: [
        'Reducción del 91% en ausencias a citas',
        'Aumento del 38% en reservas online',
        'Liberación de 8 horas semanales en gestión'
      ]
    }
  ];

  const processSteps = [
    {
      number: '1',
      title: 'Auditoría gratuita',
      description: 'Analizamos tu presencia actual en Google y detectamos oportunidades de mejora en 15-20 minutos.'
    },
    {
      number: '2',
      title: 'Diseño y creación',
      description: 'Creamos tu web y configuramos las automatizaciones con IA adaptadas a tu negocio en pocos días.'
    },
    {
      number: '3',
      title: 'Optimización Google',
      description: 'Optimizamos tu Google My Business y SEO local para que aparezcas cuando te busquen.'
    },
    {
      number: '4',
      title: 'Formación y puesta en marcha',
      description: 'Te enseñamos a usar todas las herramientas y lanzamos tu nueva presencia digital.'
    },
    {
      number: '5',
      title: 'Soporte continuo',
      description: 'Soporte mensual, mejoras constantes y actualizaciones para que sigas creciendo.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Casos de Éxito - Digitaliza Coruña</title>
        <meta name="description" content="Descubre cómo hemos ayudado a negocios locales en A Coruña a digitalizar sus operaciones y aumentar sus ventas." />
      </Helmet>

      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Casos de éxito
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Resultados reales de negocios locales en A Coruña que han digitalizado sus operaciones
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {cases.map((caseStudy, index) => (
            <CaseCard key={index} {...caseStudy} index={index} reverse={index % 2 !== 0} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nuestro proceso simple y efectivo en 5 pasos
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="text-6xl font-bold text-accent/20 shrink-0" style={{ letterSpacing: '-0.02em' }}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CasesPage;