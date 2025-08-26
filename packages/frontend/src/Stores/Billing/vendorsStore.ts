// vendors.store.ts
import { create } from 'zustand';
import { Vendor, Expense } from 'shared-types';
import axiosInstance from '../../Service/Axios'; // ודאי שזה הנתיב הנכון

interface VendorsState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  expenses: Expense[];
  loading: boolean;
  error?: string;
  fetchVendors: () => Promise<void>;
  selectVendor: (vendorId: string | null) => void;
  deleteVendor: (vendorId: string) => Promise<void>;
  fetchExpensesByVendorId: (vendorId: string) => Promise<void>;
}

export const useVendorsStore = create<VendorsState>((set, get) => ({
  vendors: [],
  selectedVendor: null,
  expenses: [],
  loading: false,
  error: undefined,

  fetchVendors: async () => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.get('/vendor/');
      set({ vendors: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "שגיאה בטעינת ספקים", loading: false });
    }
  },

  selectVendor: (vendorId: string | null) => {
    const vendor = get().vendors.find(v => v.id === vendorId) || null;
    set({ selectedVendor: vendor });
  },

  deleteVendor: async (vendorId: string) => {
    try {
      await axiosInstance.delete(`/vendor/${vendorId}`);
      set(state => ({
        vendors: state.vendors.filter(v => v.id !== vendorId),
        selectedVendor: state.selectedVendor?.id === vendorId ? null : state.selectedVendor
      }));
    } catch (error) {
      console.error("שגיאה במחיקת ספק:", error);
    }
  },

  fetchExpensesByVendorId: async (vendorId: string) => {
    try {
      const res = await axiosInstance.get(`/vendor/getExpensesByVendorId/${vendorId}`);
      set({ expenses: res.data });
    } catch (error) {
      console.error("שגיאה בטעינת הוצאות:", error);
      set({ expenses: [] });
    }
  },
}));
