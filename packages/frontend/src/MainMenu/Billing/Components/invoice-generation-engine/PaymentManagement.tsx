
import React, { useState, useEffect } from 'react';
import { usePaymentStore } from '../invoice-generation-engine/paymentStore';
import type{ Payment } from 'shared-types';
import { PaymentMethodType, PaymentStatus } from 'shared-types';
interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  reference?: string;
}

const PaymentManagement: React.FC = () => {
  const {
    payments,
    getAllPayments,
    updatePayment,
    addPayment,
    deletePayment
  } = usePaymentStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceId: '',
    amount: 0,
    paymentMethod: PaymentMethodType.CREDIT_CARD,
    status: PaymentStatus.PENDING
  });

  useEffect(() => {
    getAllPayments();
  }, [getAllPayments]);

  const resetForm = () => {
    setFormData({
      invoiceId: '',
      amount: 0,
      paymentMethod: PaymentMethodType.CREDIT_CARD,
      status: PaymentStatus.PENDING
    });
    setEditingPayment(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   const paymentData: Payment = {
  id: editingPayment || Date.now().toString(),
  customer_id: 'someCustomerId',
  customer_name: 'שם הלקוח',
  method: formData.paymentMethod,
  amount: formData.amount,
  invoice_id: formData.invoiceId,
  date: new Date().toISOString(),
  transaction_reference: formData.reference || '',
  createdAt: editingPayment ? payments.find(p => p.id === editingPayment)?.createdAt || '' : new Date().toISOString(),
  updatedAt: new Date().toISOString()
  // status: formData.status,  // להסיר אם לא קיים בממשק
};

    try {
      if (editingPayment) {
        await updatePayment(paymentData);
      } else {
        await addPayment(paymentData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleEdit = (payment: any) => {
    setFormData({
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status
    });
    setEditingPayment(payment.id);
    setShowForm(true);
  };

  const handleDelete = async (payment: any) => {
    try {
      await deletePayment(payment);
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return (
    <></>
 
    )   };

export default PaymentManagement;