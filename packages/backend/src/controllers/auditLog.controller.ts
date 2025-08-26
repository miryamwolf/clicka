import { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLog.service';

// הגדרת קונטרולר מבוסס מחלקה עבור יומן הפעולות (Audit Log)
export class AuditLogController {
  // יצירת מופע של השירות
  auditLogService = new AuditLogService();

  // פעולה: שליפת רשומות יומן עם אפשרות לפילטרים
  async getAuditLogs(req: Request, res: Response) {
    try {
      // חילוץ פרמטרים מתוך query string
      const { userEmail, functionName, startDate, endDate, limit, date } = req.query;

      // בניית אובייקט פילטרים
      const filters = {
        userEmail: userEmail as string,
        functionName: functionName as string, 
        startDate: startDate as string,
        endDate: endDate as string,
        // אם נשלח date בלבד, נשתמש בו גם בתור startDate וגם endDate
        ...(date && !startDate && !endDate && {
          startDate: `${date}T00:00:00.000Z`,
          endDate: `${date}T23:59:59.999Z`
        }),
        limit: limit ? parseInt(limit as string) : 100, // אם לא ניתן מגבלה, תשתמש ב-50 כערך ברירת מחדל
      };

      // שליפת רשומות לפי הפילטרים
      const auditLogs = await this.auditLogService.getAuditLogs(filters);

      // החזרת תוצאות
      return res.status(200).json(auditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
  }
}