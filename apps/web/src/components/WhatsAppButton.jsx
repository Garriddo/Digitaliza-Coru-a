import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { whatsappUrl } from '@/config/siteConfig.js';

function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappUrl('Hola, quiero solicitar una auditoría gratis para mi negocio.')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center gap-2 h-14 w-14 sm:w-auto sm:px-5 bg-[#25D366] text-white rounded-full shadow-xl shadow-black/25 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      whileHover={{ y: -2 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline text-sm font-bold">WhatsApp</span>
    </motion.a>
  );
}

export default WhatsAppButton;
