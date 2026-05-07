import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const serviceProducts = [
  {
    id: 'pkg-basic',
    title: 'Paquete Básico',
    subtitle: 'Presencia online profesional para tu taller',
    image: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=800',
    ribbon_text: null,
    variants: [{
      id: 'var-basic-1',
      title: 'Básico (Pago Inicial)',
      price_in_cents: 39900,
      price_formatted: '399,00 €',
      sale_price_in_cents: null,
      sale_price_formatted: null,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '€', code: 'EUR' }
    }]
  },
  {
    id: 'pkg-pro',
    title: 'Paquete Pro',
    subtitle: 'Automatización completa y aumento de ventas',
    image: 'https://images.unsplash.com/photo-1648134859211-4a1b57575f4e?auto=format&fit=crop&q=80&w=800',
    ribbon_text: 'RECOMENDADO PARA TALLERES',
    variants: [{
      id: 'var-pro-1',
      title: 'Pro (Pago Inicial)',
      price_in_cents: 84900,
      price_formatted: '849,00 €',
      sale_price_in_cents: null,
      sale_price_formatted: null,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '€', code: 'EUR' }
    }]
  },
  {
    id: 'pkg-premium',
    title: 'Paquete Premium',
    subtitle: 'Máxima automatización + Tienda Online + Publicidad',
    image: 'https://images.unsplash.com/photo-1677693944335-178ba4f745d2?auto=format&fit=crop&q=80&w=800',
    ribbon_text: null,
    variants: [{
      id: 'var-prem-1',
      title: 'Premium (Pago Inicial)',
      price_in_cents: 119900,
      price_formatted: '1.199,00 €',
      sale_price_in_cents: null,
      sale_price_formatted: null,
      inventory_quantity: 999,
      manage_inventory: false,
      currency_info: { symbol: '€', code: 'EUR' }
    }]
  }
];

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const displayVariant = product.variants[0];
  const displayPrice = displayVariant.price_formatted;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      addToCart(product, displayVariant, 1, displayVariant.inventory_quantity);
      toast({
        title: "¡Añadido al carrito! 🛒",
        description: `${product.title} se ha añadido correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al añadir al carrito",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const isRecommended = product.id === 'pkg-pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col h-full"
    >
      <div className={`flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 border-2 ${isRecommended ? 'border-[#FF6B00]' : 'border-transparent'}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent opacity-80" />
          
          {product.ribbon_text && (
            <div className="absolute top-4 left-4 bg-[#FF6B00] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
              {product.ribbon_text}
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <h3 className="text-xl md:text-2xl font-bold text-white text-balance leading-tight drop-shadow-md">
              {product.title}
            </h3>
            <div className="bg-white/95 text-[#0A2540] px-3 py-1 rounded-lg font-bold shadow-md">
              {displayPrice}
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 flex-1">
            {product.subtitle}
          </p>
          
          <div className="mt-auto space-y-3">
            <Button 
              onClick={handleAddToCart} 
              className={`w-full font-bold h-12 transition-all active:scale-[0.98] ${
                isRecommended 
                  ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white' 
                  : 'bg-[#0A2540] hover:bg-[#0A2540]/90 text-white'
              }`}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al carrito
            </Button>
            <Button asChild variant="outline" className="w-full h-12 font-semibold">
              <Link to="/services">Ver detalles</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {serviceProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;