export const SITE_CONFIG = {
  BUSINESS_NAME: 'Digitaliza Coruña',
  DOMAIN: 'digitalizacoruna.es',
  PHONE_NUMBER: '+34 634 21 84 80',
  PHONE_LINK: 'tel:+34634218480',
  WHATSAPP_NUMBER: '34634218480',
  EMAIL: 'info@digitalizacoruna.es',
  SUPPORT_EMAIL: 'soporte@digitalizacoruna.es',
  LOGIN_URL: '/login',
  PRIVACY_URL: '/privacy',
  CTA_LINKS: {
    audit: '/contact',
    services: '/services',
    demos: '/demos',
    dashboard: '/dashboard',
  },
};

export const whatsappUrl = (message = 'Hola, me gustaría solicitar una auditoría gratis para mi negocio.') =>
  `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const PACK_PRICES = {
  basico: {
    setup: '399€',
    monthly: '29€/mes',
    monthlyFull: '399€ pago único + 29€/mes',
  },
  pro: {
    setup: '849€',
    monthly: 'desde 79€/mes',
    monthlyFull: '849€ pago único + desde 79€/mes',
  },
  premium: {
    setup: '1.199€',
    monthly: 'desde 119€/mes',
    monthlyFull: '1.199€ pago único + desde 119€/mes',
  },
};
