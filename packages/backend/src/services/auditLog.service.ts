import { AuditLog, AuditLogModel } from '../models/auditLog.model';
import { ID } from '../../../shared-types';
import { Request } from 'express';
import { getUserFromCookie } from '../services/tokenService'; 
import { supabase } from '../db/supabaseClient';


export class AuditLogService {
  
  async createAuditLog(req: Request, data: Omit<AuditLog, 'id' | 'userEmail'>): Promise<AuditLogModel | null> {
    try {
      // Extract user details from the cookie
      const userInfo = getUserFromCookie(req);
      console.log('User info:', userInfo);
      
      if (!userInfo) {
        console.error('No valid user found in cookie for audit log');
        return null;
      }

      const auditLog = new AuditLogModel({
        userEmail: userInfo.email,
        ...data
      });
      console.log(auditLog);
      
      await this.saveToDatabase(auditLog);
      return auditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      return null;
    }
  }

  // פונקציה נוספת אם תרצה לקבל גם את ה-userId ו-googleId לצרכים נוספים
  async createAuditLogWithUserInfo(req: Request, data: Omit<AuditLog, 'id' | 'userEmail'>): Promise<{ auditLog: AuditLogModel; userInfo: { userId: string; email: string; googleId: string } } | null> {
    try {
      const userInfo = getUserFromCookie(req);
      
      if (!userInfo) {
        console.error('No valid user found in cookie for audit log');
        return null;
      }

      const auditLog = new AuditLogModel({
        userEmail: userInfo.email,
        ...data
      });

      await this.saveToDatabase(auditLog);
      
      return {
        auditLog,
        userInfo
      };
    } catch (error) {
      console.error('Error creating audit log:', error);
      return null;
    }
  }

  private async saveToDatabase(auditLog: AuditLogModel): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('audit_logs') 
        .insert([auditLog.toDatabaseFormat()]);

      if (error) {
        console.error('Error saving audit log to database:', error);
        throw error;
      }
      
    } catch (error) {
      console.error('Error saving audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(filters?: {
    userEmail?: string;
    action?: string;
    functionName?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<AuditLogModel[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*');

      // הוספת פילטרים
      if (filters?.userEmail) {
        query = query.ilike('user_email', `%${filters.userEmail}%`);
      }

      if (filters?.action) {
        query = query.eq('action', `%${filters.action}%`);
      }

      if (filters?.functionName) {
        query = query.ilike('function_name', `%${filters.functionName}%`);
      }

      if (filters?.startDate) {
        query = query.gte('timestamp', `%${filters.startDate}%`);
      }

      if (filters?.endDate) {
        query = query.lte('timestamp', `%${filters.endDate}%`);
      }

      // מיון לפי תאריך (החדשים ראשונים)
      query = query.order('timestamp', { ascending: false });

      // הגבלת מספר התוצאות
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }

      return AuditLogModel.fromDatabaseFormatArray(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  // שליפת audit logs לפי אימייל משתמש
  async getAuditLogsByUserEmail(userEmail: string, limit?: number): Promise<AuditLogModel[]> {
    return this.getAuditLogs({
      userEmail,
      limit
    });
  }

  // שליפת audit logs לפי פעולה
  async getAuditLogsByAction(action: string, limit?: number): Promise<AuditLogModel[]> {
    return this.getAuditLogs({
      action,
      limit
    });
  }

  // שליפת audit logs לפי תקופת זמן
  async getAuditLogsByDateRange(startDate: string, endDate: string, limit?: number): Promise<AuditLogModel[]> {
    return this.getAuditLogs({
      startDate,
      endDate,
      limit
    });
  }

  // שליפת audit logs של משתמש מהקוקי
  async getUserAuditLogs(req: Request, limit?: number): Promise<AuditLogModel[]> {
    try {
      const userInfo = getUserFromCookie(req);
      
      if (!userInfo) {
        console.error('No valid user found in cookie');
        return [];
      }

      return this.getAuditLogsByUserEmail(userInfo.email, limit);
    } catch (error) {
      console.error('Error fetching user audit logs:', error);
      return [];
    }
  }

  // פונקציה עזר לקבלת פרטי המשתמש מהקוקי
  getUserInfoFromRequest(req: Request): { userId: string; email: string; googleId: string } | null {
    return  getUserFromCookie(req);
  }

  // פונקציה לספירת audit logs לפי משתמש
  async countAuditLogsByUser(userEmail: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', userEmail);

      if (error) {
        console.error('Error counting audit logs:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error counting audit logs:', error);
      return 0;
    }
  }

  // פונקציה לספירת audit logs לפי פעולה
  async countAuditLogsByAction(action: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('action', action);

      if (error) {
        console.error('Error counting audit logs by action:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error counting audit logs by action:', error);
      return 0;
    }
  }

  // פונקציה למחיקת audit logs ישנים (לניקוי תקופתי)
  async deleteOldAuditLogs(olderThanDays: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      const cutoffDateISO = cutoffDate.toISOString();

      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .lt('timestamp', cutoffDateISO)
        .select();

      if (error) {
        console.error('Error deleting old audit logs:', error);
        return 0;
      }

      const deletedCount = data?.length || 0;
      console.log(`Deleted ${deletedCount} audit logs older than ${cutoffDateISO}`);
      return deletedCount;
    } catch (error) {
      console.error('Error deleting old audit logs:', error);
      return 0;
    }
  }

  // פונקציה לקבלת סטטיסטיקות audit logs
  async getAuditLogStats(): Promise<{
    totalLogs: number;
    uniqueUsers: number;
    topActions: { action: string; count: number }[];
    recentActivity: AuditLogModel[];
  }> {
    try {
      // סך כל הלוגים
      const { count: totalLogs, error: totalError } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error getting total logs count:', totalError);
      }

      // מספר משתמשים ייחודיים - צריך לעשות query מותאם אישית
      const { data: uniqueUsersData, error: uniqueUsersError } = await supabase
        .from('audit_logs')
        .select('user_email')
        .order('user_email');

      let uniqueUsers = 0;
      if (!uniqueUsersError && uniqueUsersData) {
        const uniqueEmails = new Set(uniqueUsersData.map((row: { user_email: string }) => row.user_email));
        uniqueUsers = uniqueEmails.size;
      }

      // פעולות מובילות - צריך לעשות aggregation ידני
      const { data: actionsData, error: actionsError } = await supabase
        .from('audit_logs')
        .select('action');

      let topActions: { action: string; count: number }[] = [];
      if (!actionsError && actionsData) {
        const actionCounts = actionsData.reduce((acc: any, row: { action: string }) => {
          acc[row.action] = (acc[row.action] || 0) + 1;
          return acc;
        }, {});

        topActions = Object.entries(actionCounts)
          .map(([action, count]) => ({ action, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      // פעילות אחרונה
      const recentActivity = await this.getAuditLogs({ limit: 10 });

      return {
        totalLogs: totalLogs || 0,
        uniqueUsers,
        topActions,
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching audit log stats:', error);
      return {
        totalLogs: 0,
        uniqueUsers: 0,
        topActions: [],
        recentActivity: []
      };
    }
  }

  private generateId(): ID {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}