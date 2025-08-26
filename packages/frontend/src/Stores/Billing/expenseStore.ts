// import { create } from "zustand";
// import type{ ID, Expense, FileReference } from "shared-types";
// interface ExpenseState {
//   expenses: Expense[];
//   selectedExpense?: Expense;
//   expenseDocuments: FileReference[];
//   loading: boolean;
//   error?: string;
//   // CRUD
//   fetchExpenses: () => Promise<void>;
//   fetchExpenseDetails: (expenseId: ID) => Promise<void>;
//   createExpense: (expenseData: Expense) => Promise<Expense>;
//   updateExpense: (expenseId: ID, updatedExpenseData: Expense) => Promise<Expense>;
//   deleteExpense: (expenseId: ID) => Promise<void>;
//   // List & Filter
//  // handleSearch: (query: string) => void;
//  // handleFilter: (filter: ExpenseFilter) => void;
//   //filterExpenses: (filter: ExpenseFilter) => Promise<Expense[]>;
//   //refreshExpenseList: () => Promise<void>;
//   //handleSelectExpense: (expenseId: ID) => void;
//   // Details
//   updateExpenseStatus: (expenseId: ID, status: string) => Promise<Expense>;
//   fetchExpenseDocuments: (expenseId: ID) => Promise<void>;
//   // Form
//   handleFieldChange: (field: keyof Expense, value: any) => void;
//   // validateExpenseForm: (data: Expense) => ValidationResult;
//   handleCreateExpense: (data: Expense) => Promise<Expense>;
//   handleUpdateExpense: (expenseId: ID, data: Expense) => Promise<Expense>;
//   resetForm: () => void;
//  // handleCloseForm: () => void;
//   // Filter UI
//  // applyExpenseFilter: (filter: ExpenseFilter) => void;
// };
// export const useExpenseStore = create<ExpenseState>((set) => ({
//   expenses: [],
//   selectedExpense: undefined,
//   expenseDocuments: [],
//   loading: false,
//   error: undefined,
//   // CRUD
//   fetchExpenses: async () => {},
//   fetchExpenseDetails: async () => {},
//   createExpense: async () => { return {} as Expense; },
//   updateExpense: async () => { return {} as Expense; },
//   deleteExpense: async () => {},
//   // List & Filter
//   //handleSearch: () => {},
//   //handleFilter: () => {},
//   //filterExpenses: async () => { return []; },
//   //refreshExpenseList: async () => {},
//  // handleSelectExpense: () => {},
//   // Details
//   updateExpenseStatus: async () => { return {} as Expense; },
//   fetchExpenseDocuments: async () => {},
//   // Form
//   handleFieldChange: () => {},
//   validateExpenseForm: () => ({ isValid: true, errors: [] }),
//   handleCreateExpense: async () => { return {} as Expense; },
//   handleUpdateExpense: async () => { return {} as Expense; },
//   resetForm: () => {},
//   //handleCloseForm: () => {},
//   // Filter UI
//  // applyExpenseFilter: () => {},
// }));
import { create } from "zustand";
import type { ID, Expense, FileReference } from "shared-types";
import axiosInstance from '../../Service/Axios';
interface ExpenseState {
  expenses: Expense[]; // מערך הוצאות
  selectedExpense?: Expense; // הוצאה נבחרת לפרטים או עריכה
  expenseDocuments: FileReference[]; // מסמכים קשורים להוצאה
  loading: boolean; // סטטוס טעינה
  error?: string; // הודעת שגיאה
  // פעולות CRUD
  fetchExpenses: () => Promise<void>; // שליפת כל ההוצאות
  fetchPettyCashExpenses: () => Promise<void>; // שליפת הוצאות קופה קטנה
  fetchExpenseDetails: (expenseId: ID) => Promise<void>; // שליפת פרטי הוצאה ספציפית
  createExpense: (expenseData: Expense) => Promise<Expense | null>; // יצירת הוצאה חדשה
  updateExpense: (expenseId: ID, updatedExpenseData: Expense) => Promise<Expense | null>; // עדכון הוצאה קיימת
  deleteExpense: (expenseId: ID) => Promise<void>; // מחיקת הוצאה
  // פעולות נוספות
  fetchExpenseDocuments: (expenseId: ID) => Promise<void>; // שליפת מסמכים להוצאה
  updateExpenseStatus: (expenseId: ID, status: string) => Promise<Expense | null>; // סימון הוצאה כבתשלום
  // ניהול טופס
  handleFieldChange: (field: keyof Expense, value: any) => void; // עדכון שדה בטופס
  resetForm: () => void; // איפוס טופס
  // חישובי קופה קטנה
  getPettyCashSummary: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
  };
  getExpensesBySourceType: (sourceType: 'vendor' | 'store') => Expense[];
  getExpensesByPurchaser: (purchaserName: string) => Expense[];
}
export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [], // התחלת מערך ריק
  selectedExpense: undefined, // אין הוצאה נבחרת בהתחלה
  expenseDocuments: [], // אין מסמכים בהתחלה
  loading: false, // לא בטעינה
  error: undefined, // ללא שגיאות
  fetchExpenses: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/expenses/getAll');
      set({ expenses: response.data, loading: false, error: undefined });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  fetchExpenseDetails: async (expenseId: ID) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/expenses/getExpenseById/${expenseId}`);
      set({ selectedExpense: response.data, loading: false, error: undefined });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createExpense: async (expenseData: Expense) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/expenses/createExpense', expenseData);
      set({ loading: false, error: undefined });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  updateExpense: async (expenseId: ID, updatedExpenseData: Expense) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/expenses/updateExpense/${expenseId}`, updatedExpenseData);
      set({ loading: false, error: undefined });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  deleteExpense: async (expenseId: ID) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/expenses/deleteExpense/${expenseId}`);
      set({ loading: false, error: undefined });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  // --- שליפת מסמכים להוצאה (ניתן לממש בהמשך) ---
  fetchExpenseDocuments: async (expenseId: ID) => {
    // כרגע הדפסה בלבד, אפשר להוסיף קריאה אמיתית במידה ויש נתיב מתאים
    console.log(`Fetching documents for expense ${expenseId}`);
  },
  updateExpenseStatus: async (expenseId: ID, status: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/expenses/markExpenseAsPaid/${expenseId}`, { status });
      set({ loading: false, error: undefined });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  // --- שינוי שדה בטופס ---
  handleFieldChange: (field, value) => {
    const current = get().selectedExpense;
    if (current) {
      set({
        selectedExpense: {
          ...current,
          [field]: value,
        },
      });
    }
  },
  // --- איפוס טופס ---
  resetForm: () => {
    set({ selectedExpense: undefined, error: undefined });
  },
  // --- חישוב מצב הקופה הקטנה ---
  getPettyCashSummary: () => {
    const { expenses } = get();
    const income = expenses.filter(expense => expense.is_income);
    const expenseItems = expenses.filter(expense => !expense.is_income);
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeCount: income.length,
      expenseCount: expenseItems.length
    };
  },
  // --- סינון לפי מקור (ספק/חנות) ---
  getExpensesBySourceType: (sourceType: 'vendor' | 'store') => {
    const { expenses } = get();
    return expenses.filter(expense => expense.source_type === sourceType);
  },
  // --- סינון לפי קונה ---
  getExpensesByPurchaser: (purchaserName: string) => {
    const { expenses } = get();
    return expenses.filter(expense =>
      expense.purchaser_name.toLowerCase().includes(purchaserName.toLowerCase())
    );
  },
  fetchPettyCashExpenses: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/expenses/petty-cash');
      set({ expenses: response.data, loading: false, error: undefined });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));