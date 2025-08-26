import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { CreateExpenseRequest, UpdateExpenseRequest, GetExpensesRequest, MarkExpenseAsPaidRequest, Expense ,ExpenseCategory } from 'shared-types';
import { ExpenseModel } from '../models/expense.model';
import { baseService } from './baseService';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
export class ExpenseService extends baseService<ExpenseModel> {
  constructor() {
    super('expense');
  }
  async createExpense(expenseData: CreateExpenseRequest) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .insert([expenseData])
        .select()
        .single();
      if (error) {
        console.error('Error creating expense:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in createExpense:', err);
      return null;
    }
  }

  getExpensesByPage = async (filters: {
    page?: number;
    limit?: number;
  }): Promise<Expense[]> => {
    console.log("Service getExpensesByPage called with:", filters);

    const { page, limit } = filters;

    const pageNum = Number(filters.page);
    const limitNum = Number(filters.limit);

    if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) {
      throw new Error("Invalid filters provided for pagination");
    }

    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    // שליפת מזהה קטגוריית קופה קטנה
    const { data: pettyCashCategories } = await supabase
      .from('expense_category')
      .select('id')
      .or('name.eq.קופה קטנה,name.eq.PETTY_CASH,name.eq.Petty Cash');

    const pettyCashCategoryIds = pettyCashCategories?.map(cat => cat.id) || [];

    let query = supabase
      .from("expense")
      .select("*")
      .order("id", { ascending: false });

    // סינון הוצאות של קופה קטנה
    if (pettyCashCategoryIds.length > 0) {
      query = query.not('category_id', 'in', `(${pettyCashCategoryIds.join(',')})`);
    }

    const { data, error } = await query.range(from, to);

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("❌ Supabase error:", error.message || error);
      return Promise.reject(
        new Error(`Supabase error: ${error.message || JSON.stringify(error)}`)
      );
    }

    const leads = data || [];
    return ExpenseModel.fromDatabaseFormatArray(leads)
  };

  async getExpenses1() {
    try {
      const { data, error } = await supabase
        .from('expense')
        .select('*');
      if (error) {
        console.error('Error fetching expenses:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenses1:', err);
      return null;
    }
  }
  async getExpenses(filters: GetExpensesRequest) {
    try {
      let query = supabase.from('expense').select('*');
      console.log("Using filters:", {
        vendorId: filters.vendorId,
        category: filters.category,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection
      });
      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortDirection !== 'desc' });
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching expenses with filters:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenses:', err);
      return null;
    }
  }
  async getExpenseById(id: string) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching expense by ID:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in getExpenseById:', err);
      return null;
    }
  }
  async updateExpense(id: string, updateData: UpdateExpenseRequest) {
   const expense = await this.getExpenseById(id);
    if(updateData.status === 'PAID' && expense.status !== 'PAID') {
      //send email if have invoice
    }
      try {
      const { data, error } = await supabase
        .from('expense')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating expense:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in updateExpense:', err);
      return null;
    }
  }
  async markExpenseAsPaid(id: string, paidData: MarkExpenseAsPaidRequest) {
    try {
      const { data, error } = await supabase
        .from('expense')
        .update({
          status: 'PAID',
          paid_date: paidData.paidDate,
          payment_method: paidData.paymentMethod,
          reference: paidData.reference,
          notes: paidData.notes,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error marking expense as paid:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error in markExpenseAsPaid:', err);
      return null;
    }
  }
  async deleteExpense(id: string) {
    try {
      const { error } = await supabase
        .from('expense')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting expense:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Unexpected error in deleteExpense:', err);
      return false;
    }
  }

  async getAllExpenseCategories(): Promise<ExpenseCategory[] | null> {
    try {
      const { data, error } = await supabase
        .from('expense_category')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return null;
      }

      return data as ExpenseCategory[];
    } catch (err) {
      console.error('Unexpected error in getAllExpenseCategories:', err);
      return null;
    }
  }

  async createExpenseCategory(categoryName: string): Promise<ExpenseCategory | null> {
    try {
      const { data, error } = await supabase
        .from('expense_category')
        .insert([{ name: categoryName }])
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        if (error.code === '23505') {
          throw new Error(`הקטגוריה "${categoryName}" כבר קיימת`);
        }
        return null;
      }

      return data as ExpenseCategory;
    } catch (err) {
      console.error('Unexpected error in createExpenseCategory:', err);
      throw err;
    }
  }

  async getPettyCashExpenses(): Promise<Expense[] | null> {
    try {
      // קודם שולפים את קטגוריית קופה קטנה
      const { data: categories, error: catError } = await supabase
        .from('expense_category')
        .select('id')
        .or('name.eq.קופה קטנה,name.eq.PETTY_CASH,name.eq.Petty Cash');

      if (catError) {
        console.error('Error fetching petty cash categories:', catError);
        return null;
      }

      if (!categories || categories.length === 0) {
        return [];
      }

      const categoryIds = categories.map(cat => cat.id);

      const { data, error } = await supabase
        .from('expense')
        .select(`
          *,
          expense_category(id, name)
        `)
        .in('category_id', categoryIds);

      if (error) {
        console.error('Error fetching petty cash expenses:', error);
        return null;
      }

      return data as Expense[];
    } catch (err) {
      console.error('Unexpected error in getPettyCashExpenses:', err);
      return null;
    }
  }

  async deleteExpenseCategory(categoryId: string): Promise<boolean> {
    try {
      console.log('Attempting to delete category with ID:', categoryId);
      
      // בדיקה אם יש הוצאות שמשתמשות בקטגוריה
      const { data: expensesUsingCategory, error: checkError } = await supabase
        .from('expense')
        .select('id')
        .eq('category_id', categoryId)
        .limit(1);

      if (checkError) {
        console.error('Error checking category usage:', checkError);
        return false;
      }

      if (expensesUsingCategory && expensesUsingCategory.length > 0) {
        console.log('Category is in use, cannot delete');
        throw new Error('לא ניתן למחוק קטגוריה שבשימוש');
      }

      const { data, error } = await supabase
        .from('expense_category')
        .delete()
        .eq('id', categoryId)
        .select();

      console.log('Delete data:', data);
      console.log('Delete error:', error);

      if (error) {
        console.error('Error deleting category:', error);
        if (error.code === '23503') {
          throw new Error('לא ניתן למחוק קטגוריה שבשימוש');
        }
        return false;
      }

      return true;
    } catch (err) {
      console.error('Unexpected error in deleteExpenseCategory:', err);
      throw err;
    }
  }

}