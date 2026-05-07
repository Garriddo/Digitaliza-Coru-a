import React from 'react';
import { motion } from 'framer-motion';

function ProblemCard({ number, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-6 items-start bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-300"
    >
      <div className="text-5xl md:text-6xl font-extrabold text-accent/20 shrink-0" style={{ letterSpacing: '-0.02em' }}>
        {number}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default ProblemCard;