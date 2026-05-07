import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SITE_CONFIG } from '@/config/siteConfig.js';

function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoNegocio: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      tipoNegocio: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
      ...formData,
      timestamp: new Date().toISOString(),
      destinationEmail: SITE_CONFIG.EMAIL,
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    toast({
      title: 'Solicitud enviada con éxito',
      description: 'Te contactaremos para revisar tu negocio y ver qué automatización tiene sentido.',
    });

    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      tipoNegocio: '',
      mensaje: '',
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg border border-white/10">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-medium text-card-foreground">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="bg-background text-foreground border-border focus-visible:ring-primary"
          placeholder="Tu nombre"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-sm font-medium text-card-foreground">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            required
            value={formData.telefono}
            onChange={handleChange}
            className="bg-background text-foreground border-border focus-visible:ring-primary"
            placeholder={SITE_CONFIG.PHONE_NUMBER}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-card-foreground">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-background text-foreground border-border focus-visible:ring-primary"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoNegocio" className="text-sm font-medium text-card-foreground">Tipo de negocio</Label>
        <Select value={formData.tipoNegocio} onValueChange={handleSelectChange} required>
          <SelectTrigger className="bg-background text-foreground border-border focus-visible:ring-primary">
            <SelectValue placeholder="Selecciona tu tipo de negocio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="taller">Taller mecánico</SelectItem>
            <SelectItem value="peluqueria">Peluquería</SelectItem>
            <SelectItem value="clinica-estetica">Clínica o centro de estética</SelectItem>
            <SelectItem value="academia">Academia o centro de formación</SelectItem>
            <SelectItem value="club-deportivo">Club deportivo</SelectItem>
            <SelectItem value="otro">Otro negocio local</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje" className="text-sm font-medium text-card-foreground">Mensaje</Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          required
          value={formData.mensaje}
          onChange={handleChange}
          className="bg-background text-foreground border-border focus-visible:ring-primary min-h-32"
          placeholder="Cuéntame qué te pasa ahora: llamadas perdidas, WhatsApps acumulados, citas, presupuestos..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] font-bold text-lg py-6 shadow-md hover:shadow-lg"
        size="lg"
      >
        {isSubmitting ? 'Enviando solicitud...' : 'Solicitar auditoría gratis'}
      </Button>
    </form>
  );
}

export default ContactForm;
