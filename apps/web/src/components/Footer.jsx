import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG, whatsappUrl } from '@/config/siteConfig.js';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-5">
            <h3 className="text-2xl font-bold">
              Digitaliza <span className="text-primary">Coruña</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Automatizamos talleres y negocios locales en A Coruña para que no pierdan clientes por falta de respuesta.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-primary/40 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`mailto:${SITE_CONFIG.EMAIL}`}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-semibold text-lg mb-5 text-white">Enlaces rápidos</h4>
            <nav className="space-y-3">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
              <Link to="/services" className="block text-muted-foreground hover:text-primary transition-colors">Servicios y precios</Link>
              <Link to="/demos" className="block text-muted-foreground hover:text-primary transition-colors">Demos</Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">Sobre mí</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
              <Link to={SITE_CONFIG.PRIVACY_URL} className="block text-muted-foreground hover:text-primary transition-colors">Política de privacidad</Link>
            </nav>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-semibold text-lg mb-5 text-white">Contacto</h4>
            <div className="space-y-4">
              <a href={SITE_CONFIG.PHONE_LINK} className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.PHONE_NUMBER}</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.EMAIL}</span>
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>A Coruña, Galicia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p>&copy; {currentYear} {SITE_CONFIG.BUSINESS_NAME}. Todos los derechos reservados.</p>
          <p>Automatización local, clara y sin humo.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
