import { MapLayoutModel } from '../models/mapLayout.model';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function createLayout(layout: MapLayoutModel): Promise<MapLayoutModel | null> {
    try{
    const { data, error } = await supabase
        .from('map_layout') // שם הטבלה ב-Supabase
        .insert([layout.toDatabaseFormat()])
        .select()
        .single();

const Layout = MapLayoutModel.fromDatabaseFormat(data);
    return Layout;
}
        catch (error) {
            console.error('Error creating user:', error);
            throw error; // זריקת השגיאה כדי לטפל בה במקום אחר
        }
}
export async function getAll(): Promise<MapLayoutModel[] | null> {

    const { data, error } =  await supabase
        .from('map_layout')
        .select('*')
    if (error) {
        console.error('Error fetching maps layout :', error);
        return null;
    }
    const layouts = MapLayoutModel.fromDatabaseFormatArray(data);


    return layouts;

}

// // קבלת מפה לפי מזהה
export async function getLayoutById(id: string) {
    const { data, error } = await supabase
        .from('map_layout')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching layout:', error);
        return null;
    }

    const layout = MapLayoutModel.fromDatabaseFormat(data); // המרה לסוג UserModel
   
    return layout;
}


// // עדכון פרטי מפה
export async function updateLayout(id: string, updatedData: MapLayoutModel): Promise<MapLayoutModel | null> {
console.log('Prepared layout data for update:', JSON.stringify(updatedData, null, 2));
    const { data, error } = await supabase
        .from('map_layout')
        .update([updatedData.toDatabaseFormat()])
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating layout:', error);
        return null;
    }
     const layout = MapLayoutModel.fromDatabaseFormat(data);
    return layout;



}

// // מחיקת מפה
export async function deleteLayout(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('map_layout')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting layout:', error);
        return false;
    }

    return true;
}