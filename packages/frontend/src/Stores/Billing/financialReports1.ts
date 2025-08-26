import { create } from 'zustand'; // ייבוא ספריית Zustand ליצירת store
import { ReportData, ReportType, ReportParameters } from 'shared-types'; // ייבוא טיפוסים מה־shared-types שלך
import { fetchReportData } from '../../MainMenu/Billing/Components/FinancialReports/reportService'; // ייבוא השירות שמבצע fetch לשרת

interface FinancialReportsState {
  reportData?: ReportData;
  loading: boolean;
  error?: Error;
  fetchReport: (type: ReportType, parameters: ReportParameters) => Promise<void>;
}

export const useFinancialReportsStore = create<FinancialReportsState>((set) => ({
  reportData: undefined,
  loading: false,
  error: undefined,

  /**
   * שליחת בקשה לשרת לקבלת דוח לפי סוג ופרמטרים
   */
  fetchReport: async (type, parameters) => {
    console.log('📋 פרמטרים שנשלחים:', parameters);
    set({ loading: true, error: undefined });

    try {
      const data = await fetchReportData(type, parameters);
      console.log(' התקבלה תשובה מהשרת:', data);

      set({ reportData: data });

      // לוודא שה־state מתעדכן באמת
      set((state) => {
        console.log(' סטור לאחר עדכון:', { ...state, reportData: data });
        return { reportData: data };
      });

    } catch (error) {
      console.error(' שגיאה בקבלת הדוח:', error);
      set({ error: error as Error });
    } finally {
      set({ loading: false });
      console.log(' סיום fetchReport');
    }
  },
}));
