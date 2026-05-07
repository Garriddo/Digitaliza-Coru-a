import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

function NicheCard({ icon: Icon, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 h-full">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-semibold text-lg text-card-foreground">{label}</h3>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default NicheCard;