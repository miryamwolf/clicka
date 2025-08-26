import type{ CustomerPeriod, ExitReason, ID } from "shared-types";


export class CustomerPeriodModel implements CustomerPeriod {

  id?: ID; // PK
  customerId: ID; // FK. לקוח יכול להיות פעיל בכמה תקופות שונות (לדוגמה: עזב וחזר), לכן יש טבלת תקופות נפרדת.
  entryDate: string;
  exitDate?: string;
  exitNoticeDate?: string;
  exitReason?: ExitReason;
  exitReasonDetails?: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: ID,
    customerId: ID,
    entryDate: string,
    createdAt: string,
    updatedAt: string,
    exitDate?: string,
    exitNoticeDate?: string,
    exitReason?: ExitReason,
    exitReasonDetails?: string
  ) {
    this.id = id;
    this.customerId = customerId;
    this.entryDate = entryDate;
    this.exitDate = exitDate;
    this.exitNoticeDate = exitNoticeDate;
    this.exitReason = exitReason;
    this.exitReasonDetails = exitReasonDetails;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      customer_id: this.customerId,
      entry_date: this.entryDate,
      exit_date: this.exitDate,
      exit_notice_date: this.exitNoticeDate,
      exit_reason: this.exitReason,
      exit_reason_details: this.exitReasonDetails,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}
