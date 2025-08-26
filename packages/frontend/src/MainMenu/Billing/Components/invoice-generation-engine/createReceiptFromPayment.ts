// utils/createReceiptFromPayment.ts
import axios from 'axios';

export const createReceiptFromPayment = async (payment: {
  id: string;
  customer_name: string;
  amount: number;
  method: string;
  invoice_id: string;
  date: string;
}) => {
  try {
    const response = await axios.post('/api/documents', {
      templateId: 'receipt-default', // מזהה תבנית קיימת
      entityId: payment.id,
      variables: {
        customerName: payment.customer_name,
        amount: payment.amount,
        paymentMethod: payment.method,
        paymentDate: payment.date,
        invoiceId: payment.invoice_id
      },
      language: 'hebrew',
      deliveryMethod: 'link'
    });

    return response.data.url; // לינק לקובץ PDF
  } catch (error) {
    console.error('❌ שגיאה ביצירת קבלה:', error);
    throw error;
  }
};
