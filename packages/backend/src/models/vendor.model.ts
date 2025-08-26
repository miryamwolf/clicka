import { v4 as uuidv4 } from "uuid";
import type {
  DateISO,
  FileReference,
  ID,
  PaymentMethod,
  PaymentTerms,
  Vendor,
  VendorCategory,
  VendorStatus,
} from "shared-types";
export class VendorModel implements Vendor {
  id: ID;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  tax_id?: string;
  payment_terms?: PaymentTerms;
  preferred_payment_method?: PaymentMethod;
  category?: VendorCategory;
  status?: VendorStatus;
  notes?: string;
  document_ids?: string[];
  documents?: FileReference[];
  createdAt: DateISO;
  updatedAt: DateISO;
  constructor(params: {
    id?: ID;
    name: string;
    createdAt: DateISO;
    updatedAt: DateISO;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    tax_id?: string;
    payment_terms?: PaymentTerms;
    preferred_payment_method?: PaymentMethod;
    category?: VendorCategory;
    status?: VendorStatus;
    notes?: string;
    document_ids?: string[];
  }) {
    this.id = params.id ?? uuidv4();
    this.name = params.name;
    this.contact_name = params.contact_name;
    this.phone = params.phone;
    this.email = params.email;
    this.address = params.address;
    this.website = params.website;
    this.tax_id = params.tax_id;
    this.payment_terms = params.payment_terms;
    this.preferred_payment_method = params.preferred_payment_method;
    this.category = params.category;
    this.status = params.status;
    this.notes = params.notes;
    this.document_ids = params.document_ids;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
  toDatabaseFormat() {
    return {
      name: this.name,
      contact_name: this.contact_name,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
      tax_id: this.tax_id,
      payment_terms: this.payment_terms,
      preferred_payment_method: this.preferred_payment_method,
      category: this.category,
      status: this.status,
      notes: this.notes,
      document_ids: this.document_ids,
      documents: this.documents,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
  static fromDatabaseFormat(dbData: any): VendorModel {
    return new VendorModel({
      id: dbData.id,
      name: dbData.name,
      contact_name: dbData.contact_name,
      phone: dbData.phone,
      email: dbData.email,
      address: dbData.address,
      website: dbData.website,
      tax_id: dbData.tax_id,
      payment_terms: dbData.payment_terms,
      preferred_payment_method: dbData.preferred_payment_method,
      category: dbData.category,
      status: dbData.status,
      notes: dbData.notes,
      document_ids: dbData.document_ids,
      //documents: dbData.documents,
      createdAt: dbData.createdAt,
      updatedAt: dbData.updatedAt,
    });
  }
  static fromDatabaseFormatArray(dbDataArray: any[]): VendorModel[] {
    return dbDataArray.map(dbData => VendorModel.fromDatabaseFormat(dbData));
  }
}