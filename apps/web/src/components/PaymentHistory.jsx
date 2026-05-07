import React, { useEffect, useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReceiptPDF } from '@/lib/ReceiptPDF.js';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await pb.collection('payments').getList(1, 50, {
          filter: `user_id = "${pb.authStore.model?.id}"`,
          sort: '-fecha',
          $autoCancel: false
        });
        setPayments(result.items);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const calculateNextBilling = (dateString, plan) => {
    if (!plan || plan === 'ninguno') return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-full h-16 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl bg-card/50 m-6">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No hay pagos registrados</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Aún no tienes un historial de pagos. Cuando contrates un plan o renueves tu suscripción, aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
          <tr>
            <th className="px-6 py-4 font-semibold">ID Pago</th>
            <th className="px-6 py-4 font-semibold">Fecha</th>
            <th className="px-6 py-4 font-semibold">Plan</th>
            <th className="px-6 py-4 font-semibold">Método</th>
            <th className="px-6 py-4 font-semibold">Cantidad</th>
            <th className="px-6 py-4 font-semibold">Próximo Cobro</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold text-right">Recibo</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                {payment.id}
              </td>
              <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                {new Date(payment.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="px-6 py-4">
                <span className="capitalize text-white/90 font-medium">{payment.plan}</span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {payment.stripe_transaction_id ? 'Stripe' : 'Tarjeta'}
              </td>
              <td className="px-6 py-4 text-white font-medium">
                {payment.cantidad}€
              </td>
              <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                {calculateNextBilling(payment.fecha, payment.plan)}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  payment.estado === 'completado' ? 'bg-status-active/10 text-status-active border border-status-active/20' : 
                  payment.estado === 'pendiente' ? 'bg-status-pending/10 text-status-pending border border-status-pending/20' : 
                  'bg-destructive/10 text-destructive border border-destructive/20'
                }`}>
                  {payment.estado.charAt(0).toUpperCase() + payment.estado.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {payment.estado === 'completado' ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => generateReceiptPDF(payment)}
                    className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                  >
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}