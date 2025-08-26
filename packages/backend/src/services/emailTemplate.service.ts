import { createClient } from '@supabase/supabase-js';
import { EmailTemplateModel } from '../models/emailTemplate.model';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class EmailTemplateService {
    async createTemplate(template: EmailTemplateModel): Promise<EmailTemplateModel | null> {
        console.log('Attempting to insert template into Supabase:', template.toDatabaseFormat());
        const { data, error } = await supabase
            .from('email_template')
            .insert([template.toDatabaseFormat()])
            .select()
            .single();
        if (error) {
            console.error('Error creating email template in Supabase:', error.message, error.details, error.hint);
            return null;
        }
        console.log('Successfully created email template in Supabase, data:', data);
        return new EmailTemplateModel(data);
    }

    async getAllTemplates(): Promise<EmailTemplateModel[] | null> {
        const { data, error } = await supabase
            .from('email_template')
            .select('*');
        if (error) {
            console.error('Error fetching email templates:', error.message);
            return null;
        }
        return (data || []).map(t => new EmailTemplateModel(t));
    }

    async getTemplateById(id: string): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_template')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching template by ID:', error.message);
            return null;
        }
        return new EmailTemplateModel(data);
    }

    async getTemplateByName(name: string): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_template')
            .select('*')
            .eq('name', name)
            .single();
        if (error) {
            console.error('Error fetching template by name:', error.message);
            return null;
        }
        return new EmailTemplateModel(data);
    }

    async updateTemplate(id: string, updatedData: EmailTemplateModel): Promise<EmailTemplateModel | null> {
        const { data, error } = await supabase
            .from('email_template')
            .update(updatedData.toDatabaseFormat())
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating email template:', error.message);
            return null;
        }
        return new EmailTemplateModel(data);
    }

    async deleteTemplate(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('email_template')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting email template:', error.message);
            return false;
        }
        return true;
    }

    async renderTemplate(template: string, variables: Record<string, string>): Promise<string> {
        return template.replace(/{{(.*?)}}/g, (match, key) => {
            const variableKey = key.trim(); // מסיר רווחים מסביב לשם המשתנה
            const value = variables[variableKey];
            console.log(`:repeat: Replacing {{${variableKey}}} with:`, value ?? '[NOT FOUND]');
            console.log('Variables:', variables);
            // מחזיר את הערך אם קיים, אחרת מחרוזת ריקה (כדי למנוע השארת {{...}})
            return Object.prototype.hasOwnProperty.call(variables, variableKey)
                ? value
                : '';
        });
    }
}
