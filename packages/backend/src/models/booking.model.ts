import { randomUUID } from "node:crypto";
import { Booking, BookingStatus, DateISO, ID } from "shared-types";

export class BookingModel implements Booking {
  id?: ID;
  roomId: ID;
  roomName: string;
  customerId?: ID;
  customerName?: string;
  externalUserName?: string;
  externalUserEmail?: string;
  externalUserPhone?: string;
  startTime: DateISO;
  endTime: DateISO;
  status: BookingStatus;
  notes?: string;
  googleCalendarEventId?: string | null;
  totalHours: number;
  chargeableHours: number;
  totalCharge: number;
  isPaid: boolean;
  approvedBy?: ID;
  approvedAt?: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: {
    id?: ID;
    roomId: ID;
    roomName: string;
    startTime: DateISO;
    endTime: DateISO;
    status: BookingStatus;
    totalHours?: number;
    chargeableHours?: number;
    totalCharge?: number;
    isPaid?: boolean;
    customerId?: ID;
    customerName?: string;
    externalUserName?: string;
    externalUserEmail?: string;
    externalUserPhone?: string;
    notes?: string;
    googleCalendarEventId?: string;
    approvedBy?: ID;
    approvedAt?: DateISO;
    createdAt?: DateISO;
    updatedAt?: DateISO;
  }) {
    this.id = params.id || undefined;
    this.roomId = params.roomId;
    this.roomName = params.roomName;
    this.customerId = params.customerId;
    this.customerName = params.customerName;
    this.externalUserName = params.externalUserName;
    this.externalUserEmail = params.externalUserEmail;
    this.externalUserPhone = params.externalUserPhone;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.status = params.status;
    this.notes = params.notes;
    this.googleCalendarEventId = params.googleCalendarEventId;
    this.totalHours = params.totalHours ?? 0;
    this.chargeableHours = params.chargeableHours ?? 0;
    this.totalCharge = params.totalCharge ?? 0;
    this.isPaid = params.isPaid ?? false;
    this.approvedBy = params.approvedBy || undefined;
    this.approvedAt = params.approvedAt || undefined;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? new Date().toISOString();
  }
  static fromGoogleEvent(event: any): BookingModel {
    const startTime = event.start?.dateTime || event.start?.date;
    const endTime = event.end?.dateTime || event.end?.date;
    
    // חישוב שעות
    let totalHours = 0;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      totalHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 100) / 100;
    }
    
    return new BookingModel({
      id: randomUUID(),
      roomId: '6e19a553-e8ee-4c75-9046-6b374af4d998',
      roomName: event.location || "לא ידוע",
      startTime,
      endTime,
      status: BookingStatus.PENDING,
      totalHours,
      chargeableHours: totalHours,
      totalCharge: 0,
      isPaid: false,
      customerId: undefined,
      customerName: undefined,
      externalUserName: event.creator?.displayName || event.summary || undefined,
      externalUserEmail: event.creator?.email || undefined,
      notes: event.description || undefined,
      googleCalendarEventId: event.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }



  toDatabaseFormat() {
    return {
      id: this.id,
      room_id: this.roomId,
      room_name: this.roomName,
      customer_id: this.customerId,
      customer_name: this.customerName,
      external_user_name: this.externalUserName,
      external_user_email: this.externalUserEmail,
      external_user_phone: this.externalUserPhone,
      start_time: this.startTime,
      end_time: this.endTime,
      status: this.status,
      notes: this.notes,
      google_calendar_event_id: this.googleCalendarEventId,
      total_hours: this.totalHours,
      chargeable_hours: this.chargeableHours,
      total_charge: this.totalCharge,
      is_paid: this.isPaid,
      approved_by: this.approvedBy,
      approved_at: this.approvedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,

    }
  }
  static fromDatabaseFormat(dbData: any): BookingModel {
    return new BookingModel({
      id: dbData.id,
      roomId: dbData.room_id,
      roomName: dbData.room_name,
      customerId: dbData.customer_id,
      customerName: dbData.customer_name,
      externalUserName: dbData.external_user_name,
      externalUserEmail: dbData.external_user_email,
      externalUserPhone: dbData.external_user_phone,
      startTime: dbData.start_time,
      endTime: dbData.end_time,
      status: dbData.status,
      notes: dbData.notes,
      googleCalendarEventId: dbData.google_calendar_event_id,
      isPaid: dbData.is_paid,
      totalHours: dbData.total_hours,
      chargeableHours: dbData.chargeable_hours,
      totalCharge: dbData.total_charge,
      approvedBy: dbData.approved_by,
      approvedAt: dbData.approved_at,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at,
    });
  }
  static fromDatabaseFormatArray(dbDataArray: any[]): BookingModel[] {
    return dbDataArray.map(dbData => BookingModel.fromDatabaseFormat(dbData));
  }
}
