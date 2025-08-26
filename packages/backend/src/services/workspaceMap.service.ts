import { WorkspaceMapModel } from '../models/workspaceMap.model';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
// טוען את משתני הסביבה מקובץ .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || ''; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = process.env.SUPABASE_KEY || ''; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createWorkspaceMap(map: WorkspaceMapModel): Promise<WorkspaceMapModel | null> {
    const { data, error } = await supabase
        .from('workspace_map') // שם הטבלה ב-Supabase
        .insert([map]) // המרת המפה לפורמט המתאים למסד הנתונים
        .select()
        .single();

    if (error) {
        console.error('Error creating map:', error);
        return null;
    }
    const createdMap = data as WorkspaceMapModel; // המרה לסוג WorkspaceMapModel
    // רישום פעילות המשתמש
    // logUserActivity(user.id? user.id:user.firstName, 'User created');
    //החזרת המשתמש שנוצר
    return createdMap;
}
//קבלת כל המפות הקיימות
export async function getAllmaps(): Promise<WorkspaceMapModel[] | null> {

    const { data, error } = await await supabase
        .from('workspace_map')
        .select('*')
    if (error) {
        console.error('Error fetching workspace maps:', error);
        return null;
    }
    const maps = data as WorkspaceMapModel[];

    //  maps.forEach(map => {
    //     logUserActivity(map.id? map.id:map.name, 'Map fetched');
    // });
    //         // מחזיר את כל המפות שנמצאו
    return maps;

}

// // קבלת מפה לפי מזהה
export async function getWorkspaceMapById(id: string) {
    const { data, error } = await supabase
        .from('workspace_map')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching map:', error);
        return null;
    }

    const map = data as WorkspaceMapModel; // המרה לסוג UserModel
    // רישום פעילות המשתמש
    // logUserActivity(user.id? user.id:user.firstName, 'User fetched by ID');
    // מחזיר את המשתמש שנמצא
    return map;
}
export async function getWorkspaceMapByName(name: string) {
    const { data, error } = await supabase
        .from('workspace_map')
        .select('*')
        .eq('name', name)
        .single();

    if (error) {
        console.error('Error fetching name:', error);
        return null;
    }

    const map = data as WorkspaceMapModel; // המרה לסוג UserModel
    // רישום פעילות המשתמש
    // logUserActivity(user.id? user.id:user.firstName, 'User fetched by ID');
    // מחזיר את המשתמש שנמצא
    return map;
}
// // סינון מפה
// export async function filterMap(id: any) { 
// }

// // עדכון פרטי מפה
export async function updateWorkspaceMap(id: string, updatedData: WorkspaceMapModel): Promise<WorkspaceMapModel | null> {

    const { data, error } = await supabase
        .from('workspace_map')
        .update([updatedData.toDatabaseFormat()])
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating map:', error);
        return null;
    }

     const map =  WorkspaceMapModel.fromDatabaseFormat(data); 
  
    return map;



}

// // מחיקת מפה
export async function deleteWorkspaceMap(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('workspace_map')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting map:', error);
        return false;
    }
    // רישום פעילות המשתמש
    // logUserActivity(id, 'User deleted');
    // // מחזיר true אם המשתמש נמחק בהצלחה
    return true;
}




