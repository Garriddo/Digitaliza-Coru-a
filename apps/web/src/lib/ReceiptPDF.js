import { jsPDF } from 'jspdf';

export const generateReceiptPDF = (payment) => {
  const doc = new jsPDF();
  
  // Add some simple branding
  doc.setFontSize(22);
  doc.setTextColor(255, 107, 0); // Primary orange
  doc.text('Digitaliza Coruña', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Recibo de Pago', 20, 45);
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  
  const startY = 65;
  const lineSpacing = 10;
  
  // Format date
  const dateObj = new Date(payment.fecha);
  const formattedDate = isNaN(dateObj.getTime()) ? '-' : dateObj.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  doc.text(`ID de Recibo:`, 20, startY);
  doc.text(`${payment.id}`, 80, startY);
  
  doc.text(`Fecha:`, 20, startY + lineSpacing);
  doc.text(`${formattedDate}`, 80, startY + lineSpacing);
  
  doc.text(`Plan Contratado:`, 20, startY + lineSpacing * 2);
  doc.text(`${payment.plan ? payment.plan.toUpperCase() : '-'}`, 80, startY + lineSpacing * 2);
  
  doc.text(`Estado:`, 20, startY + lineSpacing * 3);
  doc.text(`${payment.estado.toUpperCase()}`, 80, startY + lineSpacing * 3);
  
  if (payment.stripe_transaction_id) {
    doc.text(`Transacción (Stripe):`, 20, startY + lineSpacing * 4);
    doc.text(`${payment.stripe_transaction_id}`, 80, startY + lineSpacing * 4);
  }
  
  // Line separator before total
  doc.line(20, startY + lineSpacing * 5.5, 190, startY + lineSpacing * 5.5);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Pagado:`, 20, startY + lineSpacing * 7);
  doc.text(`${payment.cantidad} €`, 80, startY + lineSpacing * 7);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Este documento es un comprobante de pago emitido electrónicamente.', 20, 270);
  doc.text('Si tienes alguna duda, contacta con soporte@digitalizacoruna.es', 20, 275);
  
  // Save the PDF
  doc.save(`recibo-${payment.id}.pdf`);
};