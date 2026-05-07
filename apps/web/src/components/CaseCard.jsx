import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

function CaseCard({ title, description, image, testimonial, author, results, index, reverse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className={`${reverse ? 'md:order-2' : ''}`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div className={`${reverse ? 'md:order-1' : ''}`}>
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl md:text-3xl font-bold">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Resultados:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {results.map((result, idx) => (
                    <li key={idx}>• {result}</li>
                  ))}
                </ul>
              </div>
              {testimonial && (
                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                  "{testimonial}"
                  <footer className="text-sm font-medium text-foreground mt-2">— {author}</footer>
                </blockquote>
              )}
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Ver web de ejemplo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default CaseCard;