import type { CustomerPaymentMethod, CustomerPeriod, DateISO, ExitReason, ID } from "shared-types";
import { UUID } from "node:crypto";

export class customerPaymentMethodModel implements CustomerPaymentMethod {

  id?: UUID;
  customerId: ID;
  creditCardNumber?: string;
  creditCardExpiry?: string;
  creditCardHolderIdNumber?: string;
  creditCardHolderPhone?: string;
  isActive: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: UUID,
    customerId: ID,
    isActive: boolean,
    createdAt: DateISO,
    updatedAt: DateISO,
    creditCardNumber?: string,
    creditCardExpiry?: string,
    creditCardHolderIdNumber?: string,
    creditCardHolderPhone?: string,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.creditCardExpiry = creditCardExpiry;
    this.creditCardHolderIdNumber = creditCardHolderIdNumber;
    this.creditCardHolderPhone = creditCardHolderPhone;
    this.creditCardNumber = creditCardNumber;
  }

  toDatabaseFormat() {
    return {
      customer_id: this.customerId,
      credit_card_number: this.creditCardNumber,
      credit_card_expiry: this.creditCardExpiry,
      credit_card_holder_id_number: this.creditCardHolderIdNumber,
      credit_card_holder_phone: this.creditCardHolderPhone,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  static fromDatabaseFormat(dbData: any): customerPaymentMethodModel {
    return new customerPaymentMethodModel(
      dbData.id,
      dbData.customer_id,
      dbData.is_active,
      dbData.created_at,
      dbData.updated_at,
      dbData.credit_card_number,
      dbData.credit_card_expiry,
      dbData.credit_card_holder_id_number,
      dbData.credit_card_holder_phone
    );
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): customerPaymentMethodModel[] {
    return dbDataArray.map(dbData => customerPaymentMethodModel.fromDatabaseFormat(dbData));
  }

  static partialToDatabaseFormat(data: Partial<customerPaymentMethodModel>) {
    const dbObj: any = {};
    if (data.customerId !== undefined) dbObj.customer_id = data.customerId;
    if (data.creditCardNumber !== undefined) dbObj.credit_card_number = data.creditCardNumber;
    if (data.creditCardExpiry !== undefined) dbObj.credit_card_expiry = data.creditCardExpiry;
    if (data.creditCardHolderIdNumber !== undefined) dbObj.credit_card_holder_id_number = data.creditCardHolderIdNumber;
    if (data.creditCardHolderPhone !== undefined) dbObj.credit_card_holder_phone = data.creditCardHolderPhone;
    if (data.isActive !== undefined) dbObj.is_active = data.isActive;
    if (data.createdAt !== undefined) dbObj.created_at = data.createdAt;
    if (data.updatedAt !== undefined) dbObj.updated_at = data.updatedAt;
    // הוסיפי כאן שדות נוספים במידת הצורך
    return dbObj;
}
}
