import { create } from "zustand";
import type{ FileReference, ID, DateRangeFilter, ExpenseCategory, WorkspaceType, FinancialReport, ReportData, ReportType, ReportParameters, RevenueReportData, RevenueReportResponse } from "shared-types";
interface FinancialReportsState {
  reports: FinancialReport[];
  reportData?: ReportData;
  selectedReport?: FinancialReport;
  error?: Error;
  loading: boolean;

  // דוחות
  generateReport: (type: ReportType, parameters: ReportParameters) => Promise<FinancialReport>;
  fetchReportData: (type: ReportType, parameters: ReportParameters) => Promise<ReportData>;
  generateRevenueData: (parameters: ReportParameters) => Promise<RevenueReportResponse>;
  generateExpenseData: (parameters: ReportParameters) => Promise<ReportData>;
  generateProfitLossData: (parameters: ReportParameters) => Promise<ReportData>;
  generateCashFlowData: (parameters: ReportParameters) => Promise<ReportData>;
  generateCustomerAgingData: (parameters: ReportParameters) => Promise<ReportData>;
  generateOccupancyRevenueData: (parameters: ReportParameters) => Promise<ReportData>;
  // getExpenseReportByCategoryAndVendor: (
  //   parameters: ReportParameters,
  //   selectedCategories?: ExpenseCategory[],
  //   selectedVendorIds?: ID[]
  // ) => Promise<ExpenseReportByCategoryAndVendor>;
  // getRevenueReportByWorkspaceTypeAndPeriod: (
  //   parameters: ReportParameters,
  //   workspaceTypes?: WorkspaceType[],
  //   groupByPeriod?: 'day' | 'week' | 'month' | 'quarter' | 'year'
  // ) => Promise<RevenueReportByWorkspaceAndPeriod>;
  // handleReportGenerationTimeout: (
  //   type: ReportType,
  //   parameters: ReportParameters,
  //   timeoutMs?: number
  // ) => Promise<FinancialReport | null>;

  // ייצוא דוח
  exportReport: (
    report: FinancialReport,
    format: 'pdf' | 'csv' | 'xlsx'
  ) => Promise<FileReference>;

  // שגיאות דוחות
  handleReportError: (error: Error, context?: any) => void;

  // בקרות דוח
  // validateReportParameters: (parameters: ReportParameters) => ValidationResult;
  resetReportParameters: () => void;
  handleReportTypeChange: (type: ReportType) => void;
  handleDateRangeChange: (dateRange: DateRangeFilter) => void;
  handleCategoryChange: (categories: ExpenseCategory[]) => void;
  handleVendorChange: (vendorIds: ID[]) => void;
  handleWorkspaceTypeChange: (workspaceTypes: WorkspaceType[]) => void;
  handleGroupByChange: (groupBy: 'month' | 'quarter' | 'year') => void;

  // תצוגה
  displayReport: (report: FinancialReport) => void;
  handleExportClick: (report: FinancialReport, format: 'pdf' | 'csv' | 'xlsx') => void;
  displayReportError: (error: Error) => void;

  // הרשאות, מטמון, ביצועים
  checkUserPermissions: () => void;
  // manageCacheAndPerformance: ... (אם תצטרכי, תוסיפי כאן)
};

export const useFinancialReportsStore = create<FinancialReportsState>(
  // (set, get) => ({  reports: [],
  () => ({  reports: [],
  reportData: undefined,
  selectedReport: undefined,
  error: undefined,
  loading: false,

  generateReport: async () => { return {} as FinancialReport; },
  fetchReportData: async () => { return {} as ReportData; },
  generateRevenueData: async () => { return {} as RevenueReportResponse; },
  generateExpenseData: async () => { return {} as ReportData; },
  generateProfitLossData: async () => { return {} as ReportData; },
  generateCashFlowData: async () => { return {} as ReportData; },
  generateCustomerAgingData: async () => { return {} as ReportData; },
  generateOccupancyRevenueData: async () => { return {} as ReportData; },
  // getExpenseReportByCategoryAndVendor: async () => { return {} as ExpenseReportByCategoryAndVendor; },
  // getRevenueReportByWorkspaceTypeAndPeriod: async () => { return {} as RevenueReportByWorkspaceAndPeriod; },
  handleReportGenerationTimeout: async () => { return {} as FinancialReport; },

  exportReport: async () => { return {} as FileReference; },

  handleReportError: () => {},
  validateReportParameters: () => ({ isValid: true, errors: [] }),
  resetReportParameters: () => {},
  handleReportTypeChange: () => {},
  handleDateRangeChange: () => {},
  handleCategoryChange: () => {},
  handleVendorChange: () => {},
  handleWorkspaceTypeChange: () => {},
  handleGroupByChange: () => {},

  displayReport: () => {},
  handleExportClick: () => {},
  displayReportError: () => {},

  checkUserPermissions: () => {},
  
}));