import {parseISO,  format } from 'date-fns'; // ייבוא פונקציות עזר לטיפול בתאריכים

/**
 * פונקציה לקיבוץ מערך נתונים לפי תקופה (חודש / רבעון / שנה)
 * @param items - מערך האובייקטים המקוריים (expenses או revenues)
 * @param groupBy - לפי מה לקבץ: 'month' | 'quarter' | 'year'
 * @param dateField - שם השדה שבו נמצא התאריך בכל אובייקט (למשל: 'date')
 * @param valueField - שם השדה שבו נמצא הערך המספרי (למשל: 'amount')
 * @returns מערך מקובץ: [{ label: string, value: number }]
 */
export function groupByPeriod<T>(
  items: T[],
  groupBy: 'month' | 'quarter' | 'year' = 'month',
  dateField: keyof T,
  valueField: keyof T
): { label: string; value: number }[] {
  const groups: Record<string, number> = {}; // יצירת אובייקט להחזיק את התוצאות הזמניות

  for (const item of items) {
    const dateStr = item[dateField] as string; // חילוץ התאריך מתוך השדה
    const date = parseISO(dateStr); // המרת התאריך למבנה Date בעזרת date-fns

    let key = '';

    // בחירת פורמט הקיבוץ לפי groupBy
    switch (groupBy) {
      case 'month':
        key = format(date, 'yyyy-MM'); // דוגמה: 2025-06
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1; // חישוב רבעון
        key = `${date.getFullYear()}-Q${quarter}`; // דוגמה: 2025-Q2
        break;
      case 'year':
        key = `${date.getFullYear()}`; // דוגמה: 2025
        break;
    }

    // צבירה של הסכומים בקבוצה המתאימה
    const value = Number(item[valueField]) || 0; // שמירה על סכום מספרי תקין
    groups[key] = (groups[key] || 0) + value;
  }

  // המרת ה־object למערך תוצאה
  return Object.entries(groups).map(([label, value]) => ({ label, value }));
}
