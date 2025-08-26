import { ID, DateISO } from '../../../shared-types';

export interface AuditLog {
  id?: ID;
  userEmail: string;           // אמייל של המשתמש שביצע את הפעולה
  timestamp: DateISO;          // תאריך ושעה
  action: 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // פעולה
  functionName: string;        // איזה פונקציה
  targetInfo: string;    // אמייל של המשתמש שעליו ביצעו את הפעולה
  createdAt: DateISO;
  updatedAt: DateISO;
}

export class AuditLogModel implements AuditLog {
  id?: ID;
  userEmail: string;
  timestamp: DateISO;
  action: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  functionName: string;
  targetInfo: string;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(data: {
    id?: ID;
    userEmail: string;
    timestamp: DateISO;
    action: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    functionName: string;
    targetInfo: string;
    createdAt: DateISO;
    updatedAt: DateISO;
  }) {
    this.id = data.id || "";
    this.userEmail = data.userEmail;
    this.timestamp = data.timestamp;
    this.action = data.action;
    this.functionName = data.functionName;
    this.targetInfo = data.targetInfo;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // המרה לפורמט DB
  toDatabaseFormat() {
    return {
      user_email: this.userEmail,
      timestamp: this.timestamp,
      auditlog_action_type: this.action,
      function_name: this.functionName,
      target_info: this.targetInfo,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  // המרה מפורמט DB
  static fromDatabaseFormat(dbData: any): AuditLogModel {
    return new AuditLogModel({
      id: dbData.id,
      userEmail: dbData.user_email,
      timestamp: dbData.timestamp,
      action: dbData.action,
      functionName: dbData.function_name,
      targetInfo: dbData.target_info,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at,
    });
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): AuditLogModel[] {
    return dbDataArray.map(dbData => AuditLogModel.fromDatabaseFormat(dbData));
  }
}