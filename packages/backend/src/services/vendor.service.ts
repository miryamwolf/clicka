//server/vendor.service.ts
import { ID, Vendor, CreateVendorRequest, PaymentMethod, VendorCategory, VendorStatus, PaymentTerms, Expense } from "shared-types"
import { VendorModel } from "../models/vendor.model";
import { supabase } from '../db/supabaseClient';
import { DocumentModel } from "../models/document.model";
import { v4 as uuidv4 } from 'uuid';

export async function create(
    request: CreateVendorRequest
): Promise<Vendor> {
    try {
        const newVendorModel = new VendorModel({
            name: request.name,
            contact_name: request.contact_name,
            phone: request.phone,
            email: request.email,
            address: request.address,
            website: (request as any).website, // אם קיים ב-CreateVendorRequest, ודא שהטיפוס כולל זאת
            tax_id: request.taxId,
            payment_terms: PaymentTerms.COD,
            preferred_payment_method: PaymentMethod.BANK_TRANSFER,
            
            category: VendorCategory.Other,
            status: VendorStatus.Inactive, // סטטוס ברירת מחדל אם לא נשלח
            notes: request.notes,
            document_ids: request.documents || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        const { data, error } = await supabase
            .from('vendor')
            .insert(newVendorModel.toDatabaseFormat())
            .select()
            .single();
        if (error) {
            console.error('Error creating vendor:', error);
            throw new Error('Failed to create vendor');
        }
        return new VendorModel({
            id: data.id,
            name: data.name,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            website: (data as any).website, // אם קיים ב-CreateVendorRequest, ודא שהטיפוס כולל זאת
            tax_id: data.taxId,
            payment_terms: data.payment_terms,
            preferred_payment_method: data.preferred_payment_method,
            category: data.category,
            status: data.status, // סטטוס ברירת מחדל אם לא נשלח
            notes: data.notes,
            document_ids: data.document_ids,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    } catch (e) {
        console.error('Exception in createLoungePricing:', e);
        throw e;
    }
}
export async function getAllVendors(): Promise<Vendor[] | null> {
    console.log('Fetching all vendors');
    try {
        const { data, error } = await supabase
            .from('vendor')
            .select('*')
            .eq('active', true);
        if (error) {
            console.error('Error fetching vendors:', error);
            throw new Error('Failed to fetch vendors');
        }
        if (!data) return null;
        return data.map((vendor) => new VendorModel({
            id: vendor.id,
            name: vendor.name,
            contact_name: vendor.contact_name,
            phone: vendor.phone,
            email: vendor.email,
            address: vendor.address,
            website: vendor.website,
            tax_id: vendor.taxId,
            payment_terms: vendor.payment_terms,
            preferred_payment_method: vendor.preferred_payment_method,
            category: vendor.category,
            status: vendor.status,
            notes: vendor.notes,
            document_ids: vendor.document_ids,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt,
        }));
    } catch (e) {
        console.error('Exception in getAllVendors:', e);
        throw e;
    }
}
export async function getVendorById(id: string): Promise<Vendor | null> {
    try {
        const { data, error } = await supabase
            .from('vendor')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching vendor by ID:', error);
            throw new Error('Failed to fetch vendor');
        }
        if (!data) return null;
        return new VendorModel({
            id: data.id,
            name: data.name,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            website: (data as any).website,
            tax_id: data.taxId,
            payment_terms: data.payment_terms,
            preferred_payment_method: data.preferred_payment_method,
            category: data.category,
            status: data.status,
            notes: data.notes,
            document_ids: data.document_ids,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    } catch (e) {
        console.error('Exception in getVendorById:', e);
        throw e;
    }
}
export async function deleteVendor(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('vendor')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error deleting vendor:', error);
      throw new Error("Failed to delete vendor");
    }
    return true;
  } catch (e) {
    console.error('Exception in deleteLoungePricing:', e);
    throw e;
  }
}


export async function saveDocumentAndAttachToVendor(vendorId: string, file: any) {
  const document = new DocumentModel({
    id: uuidv4(),
    name: file.name,
    path: file.folder_path || "נתיב_ברירת_מחדל",  // חובה! לא להכניס null
    mimeType: file.mime_type || "application/octet-stream", // חובה! לא להכניס null
    size: file.size || 0, // אם יש מידע, אחרת 0
    url: file.url,
    googleDriveId: file.googleDriveId || "", // אם יש
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });



  // 2. שמירה בטבלת documents
  const { data: insertedDoc, error: insertError } = await supabase
    .from('document')
    .insert(document.toDatabaseFormat())
    .select()
    .single();

  if (insertError || !insertedDoc) {
    console.error('שגיאה בשמירת המסמך:', insertError);
    throw new Error('שמירת המסמך נכשלה');
  }

  // 3. שליפת הספק הקיים
  const { data: vendorData, error: vendorFetchError } = await supabase
    .from('vendor')
    .select('document_ids')
    .eq('id', vendorId)
    .single();

  if (vendorFetchError || !vendorData) {
    console.error('שגיאה בשליפת הספק:', vendorFetchError);
    throw new Error('שליפת הספק נכשלה');
  }

  const existingDocumentIds = vendorData.document_ids || [];

  // 4. עדכון הספק עם מערך document_ids כולל החדש
  const updatedDocumentIds = [...existingDocumentIds, insertedDoc.id];

  const { error: updateError } = await supabase
    .from('vendor')
    .update({
      document_ids: updatedDocumentIds,
      updated_at: new Date().toISOString()
    })
    .eq('id', vendorId);

  if (updateError) {
    console.error('שגיאה בעדכון מזהי המסמכים של הספק:', updateError);
    throw new Error('עדכון הספק עם מזהה המסמך נכשל');
  }

  return DocumentModel.fromDatabaseFormat(insertedDoc);
}
export async function getExpensesByVendorId(vendorId: string): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from('expense')
      .select('*')
      .eq('vendor_id', vendorId);

    if (error) {
      console.error('Error fetching expenses by vendor id:', error);
      throw new Error('Failed to fetch expenses');
    }

    return data || [];
  } catch (e) {
    console.error('Exception in getExpensesByVendorId:', e);
    throw e;
  }
}