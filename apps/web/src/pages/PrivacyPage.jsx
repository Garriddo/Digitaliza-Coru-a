import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { motion } from 'framer-motion';

function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad - Digitaliza Coruña</title>
        <meta name="description" content="Política de privacidad y protección de datos de Digitaliza Coruña." />
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
              Política de Privacidad
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Última actualización: Abril 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Información que recopilamos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En Digitaliza Coruña recopilamos la información que nos proporcionas voluntariamente a través de nuestros formularios de contacto, incluyendo nombre, teléfono, email y tipo de negocio.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Uso de la información</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                  <li>Responder a tus consultas y solicitudes de auditoría</li>
                  <li>Proporcionarte información sobre nuestros servicios</li>
                  <li>Mejorar nuestros servicios y experiencia de usuario</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Protección de datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Compartir información</h2>
                <p className="text-muted-foreground leading-relaxed">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios o cuando la ley lo requiera.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Tus derechos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tienes derecho a:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                  <li>Acceder a tus datos personales</li>
                  <li>Rectificar datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de tus datos</li>
                  <li>Solicitar la portabilidad de tus datos</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para ejercer tus derechos o si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: info@digitalizacoruna.es<br />
                  Teléfono: +34 600 000 000
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Cambios en esta política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default PrivacyPage;