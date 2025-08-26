import type{ Payment } from "shared-types";
import { create } from "zustand";

interface PaymentState {
    payments: Payment[];
    getAllPayments: () => Promise<void>;
    updatePayment: (payment: Payment) => Promise<void>;
    addPayment: (payment: Payment) => Promise<void>;
    deletePayment: (payment: Payment) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    payments: [
    ],
    getAllPayments: async () => {},
    addPayment: async (payment: Payment) => {
        set(state => ({
            payments: [...state.payments, payment]
        }));
    },
    updatePayment: async (payment: Payment) => {
        set(state => ({
            payments: state.payments.map(p => p.id === payment.id ? payment : p)
        }));
    },
    deletePayment: async (payment: Payment) => {
        set(state => ({
            payments: state.payments.filter(p => p.id !== payment.id)
        }));
    }
}));