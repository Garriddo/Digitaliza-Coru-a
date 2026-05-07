import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function ServiceCard({ title, description, price, monthlyPrice, features, isRecommended, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card 
        className={`h-full flex flex-col transition-all duration-300 ${
          isRecommended 
            ? 'scale-105 ring-2 ring-accent shadow-xl relative z-10' 
            : 'hover:shadow-lg hover:-translate-y-1 border-border/50'
        }`}
      >
        {isRecommended && (
          <div className="bg-accent text-accent-foreground text-sm font-bold tracking-wide uppercase text-center py-2 rounded-t-lg">
            RECOMENDADO PARA TALLERES
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-base mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="mb-6 pb-6 border-b border-border/50">
            <div className="text-3xl font-extrabold text-primary">{price}</div>
            {monthlyPrice && (
              <div className="text-lg font-medium text-muted-foreground mt-1">{monthlyPrice}</div>
            )}
          </div>
          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-card-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto pt-6">
          <Button 
            asChild
            className={`w-full transition-all duration-200 font-semibold ${
              isRecommended 
                ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            size="lg"
          >
            <Link to="/contact">Solicitar auditoría GRATIS</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;