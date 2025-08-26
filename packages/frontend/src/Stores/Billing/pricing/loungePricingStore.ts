// Stores/Billing/pricing/loungePricingStore.ts

import { create } from 'zustand';

// ייבוא פונקציות השירות שמתקשרות עם ה-API לקבלת ושמירת נתונים
import { 
  getCurrentLoungePricing, 
  createLoungePricingWithHistory,
  updateLoungePricing,
  deleteLoungePricing // חשוב לוודא שהפונקציה הזו מיובאת
} from '../../../Service/pricing.service';

// ייבוא טיפוסים רלוונטיים מטייפס שיירד-טייפס (shared-types)
import { LoungePricing, UpdateLoungePricingRequest } from 'shared-types';

// הגדרת מבנה הסטייט ב-store עבור תמחור לאונג'
interface LoungePricingState {
  current: LoungePricing | null;          // המחיר הנוכחי של הלאונג'
  history: LoungePricing[];                // היסטוריית מחירים (אם קיימת)
  loading: boolean;                        // מצב טעינה לUI
  error: string | null;                    // שגיאות אפשריות
  fetch: () => Promise<void>;              // פונקציה לקבלת המחיר הנוכחי
  fetchHistory: () => Promise<void>;       // פונקציה לקבלת היסטוריית מחירים
  save: (data: UpdateLoungePricingRequest, id?: string) => Promise<void>;  // שמירת מחיר חדש או עדכון מחיר קיים
  delete: (id: string) => Promise<void>;  // מחיקת מחיר ע"פ ID
}

// יצירת ה-store עם Zustand
export const useLoungePricingStore = create<LoungePricingState>((set, get) => ({
  current: null,        // אתחול המחיר הנוכחי לריק
  history: [],          // אתחול היסטוריה כריקה
  loading: false,       // אתחול מצב טעינה ל-false
  error: null,          // אתחול שגיאה ל-null

  // פונקציה לאחזור המחיר הנוכחי מה-API
  fetch: async () => {
    set({ loading: true, error: null });  // סימון התחלת טעינה וניקוי שגיאות קודמות
    try {
      const pricing = await getCurrentLoungePricing();  // קריאה לשירות לקבלת המחיר הנוכחי
      set({ current: pricing, loading: false });        // שמירת המחיר והסרת מצב טעינה
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת מחירי לאונג', loading: false }); // טיפול בשגיאה
    }
  },

  // פונקציה לאחזור היסטוריית מחירים
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      // יש להוסיף פונקציה מתאימה בשירות אם צריך, לדוגמה:
      // const historyData = await getAllLoungePricingHistory();
      // set({ history: historyData, loading: false });
      
      // אם אין פונקציה כזו, כרגע מורידים טעינה בלבד:
      set({ loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת היסטוריית מחירי לאונג', loading: false });
    }
  },

  // פונקציה לשמירת מחיר חדש או עדכון מחיר קיים
  save: async (data, id) => {
    set({ loading: true, error: null });
    try {
      if (id) {
        // עדכון מחיר קיים
        await updateLoungePricing(id, data);
      } else {
        // יצירת מחיר חדש עם היסטוריה
        await createLoungePricingWithHistory(data);
      }
      set({ loading: false });
      // רענון המחיר הנוכחי וההיסטוריה לאחר שמירה
      await get().fetch();
      await get().fetchHistory();
    } catch (e: any) {
      // טיפול בשגיאות - מקבל הודעת שגיאה מפורטת במידת האפשר
      const message = e?.response?.data?.error || e?.message || 'שגיאה בשמירת הנתונים';
      set({ error: message, loading: false });
      throw new Error(message); // זריקת שגיאה כדי לאפשר טיפול חיצוני במידת הצורך
    }
  },

  // פונקציה למחיקת מחיר לפי ID
  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteLoungePricing(id);
      set({ loading: false });
      alert('המחיר נמחק בהצלחה!'); // הודעה למשתמש על הצלחה
      // רענון המידע לאחר מחיקה
      await get().fetch();
      await get().fetchHistory();
    } catch (e: any) {
      // טיפול בשגיאות במחיקה והצגתן למשתמש
      const message = e?.response?.data?.error || e?.message || 'שגיאה במחיקת הנתונים';
      set({ error: message, loading: false });
      alert(`שגיאה במחיקה: ${message}`);
      throw new Error(message);
    }
  },
}));
