import type{ DateISO, FileReference, ID, Payment, PaymentMethodType } from "shared-types";

export class PaymentModel implements Payment{
 
     id: ID;
     customer_id: ID;
     customer_name: string;
     invoice_id?: ID;
     invoice_number?: string;
     amount: number;
     method: PaymentMethodType;
     transaction_reference?: string;
     date: DateISO;
     notes?: string;
     receipt_file?: FileReference;
     createdAt: DateISO;
     updatedAt: DateISO;
    constructor(
       id: ID,
       customer_id: ID,
       customer_name: string,
       amount: number,
       method: PaymentMethodType,
       date: DateISO,
       createdAt: DateISO,
       updatedAt: DateISO,
       transaction_reference?: string,
       invoice_id?: ID,
       notes?: string,
       receipt_file?: FileReference,
       invoice_number?: string,
    ){
        this.id=id;
        this.customer_id=customer_id;
        this.customer_name=customer_name;
        this.invoice_id=invoice_id;
        this.invoice_number=invoice_number;
        this.amount=amount;
        this.method=method;
        this.transaction_reference=transaction_reference;
        this.date=date;
        this.notes=notes;
        this.receipt_file=receipt_file;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
      }

  
     toDatabaseFormat(): Payment {
        return {
            id: this.id,
            customer_id: this.customer_id,
            customer_name: this.customer_name,
            invoice_id: this.invoice_id,
            invoice_number: this.invoice_number,
            amount: this.amount,
            method: this.method,
            transaction_reference: this.transaction_reference,
            date: this.date,
            notes: this.notes,
            receipt_file: this.receipt_file,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,};
    }   
    static fromDatabaseFormat(dbData: any): PaymentModel {
        return new PaymentModel(
            dbData.id,
            dbData.customer_id,
            dbData.customer_name,
            dbData.amount,
            dbData.method,
            dbData.date,
            dbData.createdAt,
            dbData.updatedAt,
            dbData.transaction_reference,
            dbData.invoice_id,
            dbData.notes,
            dbData.receipt_file,
            dbData.invoice_number
        );
    }
     static fromDatabaseFormatArray(dbDataArray: any[]): PaymentModel[] {
    return dbDataArray.map(dbData => PaymentModel.fromDatabaseFormat(dbData));
  }

  static partialToDatabaseFormat(data: Partial<PaymentModel>) {
    const dbObj: any = {};
    if (data.id !== undefined) dbObj.id = data.id;
    if (data.customer_id !== undefined) dbObj.customer_id = data.customer_id;
    if (data.customer_name !== undefined) dbObj.customer_name = data.customer_name;
    if (data.invoice_id !== undefined) dbObj.invoice_id = data.invoice_id;
    if (data.invoice_number !== undefined) dbObj.invoice_number = data.invoice_number;
    if (data.amount !== undefined) dbObj.amount = data.amount;
    if (data.method !== undefined) dbObj.method = data.method;
    if (data.transaction_reference !== undefined) dbObj.transaction_reference = data.transaction_reference;
    if (data.date !== undefined) dbObj.date = data.date;
    if (data.notes !== undefined) dbObj.notes = data.notes;
    if (data.receipt_file !== undefined) dbObj.receipt_file = data.receipt_file;
    if (data.createdAt !== undefined) dbObj.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) dbObj.updatedAt = data.updatedAt;
    // Add more fields here if needed
    return dbObj;
  }
}
