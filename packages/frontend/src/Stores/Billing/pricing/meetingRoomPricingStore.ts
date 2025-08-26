// useMeetingRoomPricingStore.ts

// Zustand: ספריית ניהול state גלובלי
import { create } from 'zustand';

// יבוא של פונקציות שירות לניהול נתוני התמחור
import { 
  getCurrentMeetingRoomPricing,            // שליפת המחיר הנוכחי
  createMeetingRoomPricingWithHistory,     // יצירת מחיר חדש כולל היסטוריה
  updateMeetingRoomPricing,                // עדכון מחיר קיים
  deleteMeetingRoomPricing,                // מחיקת מחיר לפי מזהה
  getAllMeetingRoomPricingHistory          // שליפת כל היסטוריית המחירים
} from '../../../Service/pricing.service';

// טיפוסים משותפים לנתוני המחירים ולבקשת עדכון
import { MeetingRoomPricing, UpdateMeetingRoomPricingRequest } from 'shared-types';

// ממשק ל-state של ה-store
interface MeetingRoomPricingState {
  current: MeetingRoomPricing | null;       // המחיר הנוכחי (אחד בלבד)
  history: MeetingRoomPricing[];            // רשימת מחירים היסטוריים
  loading: boolean;                         // האם נטען כרגע
  error: string | null;                     // הודעת שגיאה כללית
  fetch: () => Promise<void>;               // שליפת המחיר הנוכחי
  fetchHistory: () => Promise<void>;        // שליפת ההיסטוריה
  save: (data: UpdateMeetingRoomPricingRequest, id?: string) => Promise<void>; // שמירה (עדכון או יצירה)
  delete: (id: string) => Promise<void>;    // מחיקה לפי מזהה
}

// יצירת ה-store באמצעות Zustand
export const useMeetingRoomPricingStore = create<MeetingRoomPricingState>((set, get) => ({
  current: null,                            // אתחול המחיר הנוכחי לריק
  history: [],                              // אתחול ההיסטוריה כ-מערך ריק
  loading: false,                           // אתחול סטטוס טעינה
  error: null,                              // אתחול שגיאה

  // פונקציה: שליפת המחיר הנוכחי מהשרת
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const pricing = await getCurrentMeetingRoomPricing();   // קריאת API
      set({ current: pricing, loading: false });              // שמירה ל-state
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת מחירי חדרי ישיבות', loading: false });
    }
  },

  // פונקציה: שליפת כל ההיסטוריה
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const historyData = await getAllMeetingRoomPricingHistory(); // קריאת כל ההיסטוריה
      set({ history: historyData, loading: false });               // שמירה ל-state
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת היסטוריית מחירי חדרי ישיבות', loading: false });
    }
  },

  // פונקציה: שמירה (עדכון אם יש ID, יצירה חדשה אחרת)
  save: async (data, id) => {
    set({ loading: true, error: null });
    try {
      if (id) {
        await updateMeetingRoomPricing(id, data);            // עדכון מחיר קיים
      } else {
        await createMeetingRoomPricingWithHistory(data);     // יצירת חדש עם היסטוריה
      }
      set({ loading: false });
      await get().fetch();           // רענון המחיר הנוכחי
      await get().fetchHistory();    // רענון ההיסטוריה
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה בשמירת הנתונים';
      set({ error: message, loading: false });
      throw new Error(message); // משליך את השגיאה למעלה (לשימוש חיצוני)
    }
  },

  // פונקציה: מחיקת מחיר לפי ID
  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteMeetingRoomPricing(id);       // מחיקה
      set({ loading: false });
      alert('המחיר נמחק בהצלחה!');
      await get().fetch();                      // רענון המחיר הנוכחי
      await get().fetchHistory();               // רענון ההיסטוריה
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה במחיקת הנתונים';
      set({ error: message, loading: false });
      alert(`שגיאה במחיקה: ${message}`);
      throw new Error(message);
    }
  },
}));
