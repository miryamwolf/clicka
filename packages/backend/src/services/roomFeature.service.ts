
import { createClient } from '@supabase/supabase-js';
import { RoomFeatureModel } from "../models/roomFeature.model";
import type { ID } from "shared-types";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function logUserActivity(userId: string, action: string) {
  console.log(`[Activity Log] ${userId}: ${action}`);
}
//יצירת פיצ'ר
export class RoomFeatureService {
async  createFeature(feature: RoomFeatureModel): Promise<RoomFeatureModel | null> {
        console.log('📦 Inserting feature:', feature.toDatabaseFormat());
        const { data, error } = await supabase
          .from('room_feature')
          .insert([feature.toDatabaseFormat()])
          .select()
          .single();
    
   
       if (error) {
      console.log('❌ Supabase Insert Error:', error); //
    throw new Error(`Failed to create feature: ${error.message}`);
      }
    
        const createdfeature =  RoomFeatureModel.fromDatabaseFormat(data);
        //logUserActivity(feature.id ?? feature.description, 'feature created');
        return createdfeature;
}
      async getAllFeatures() {
    try {
      const { data, error } = await supabase
        .from('room_feature') // שם הטבלה שלך ב-Supabase
        .select('*');

      if (error) {
        console.error('Supabase error:', error.message);
        return null;
      }
 const createdfeature = RoomFeatureModel.fromDatabaseFormatArray(data)
      return createdfeature;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

//עדכון פיצ'ר
//בעדכון Room.status= לא פעיל יש להוסיף בדיקה האם קימת הזמנה עתידית אם כן לשלוח שגיאה
//ב-Controller לעדכון תכונות / ציוד: לפני שמוחקים — לבדוק אם יש Booking.
//בשמשנים discountedHourlyRate או hourlyRate צריך לשמור את המחיר בזמן ההזמנה ולהזמנות קימות לא לשנות מחיר אוטומטי

      async updateFeature(id: string, updatedData: RoomFeatureModel): Promise<RoomFeatureModel | null> {
    
        const { data, error } = await supabase
            .from('room_feature')
            .update([updatedData.toDatabaseFormat()])
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating feature:', error);
            return null;
        }
        const feature = RoomFeatureModel.fromDatabaseFormat(data);; 
        // רישום פעילות המשתמש
        //logUserActivity(feature.description, 'feature updated');
        // מחזיר את המשתמש המעודכן
        return feature; 
}
//קבלת פיצ'ר לפי ID
async  getFeatureById(id: string): Promise<RoomFeatureModel | null>  
{
     const { data, error } = await supabase
            .from('room_feature')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching feature:', error);
            return null;
        }

        const feature =  RoomFeatureModel.fromDatabaseFormat(data);; // המרה לסוג UserModel
        // רישום פעילות המשתמש
       // logUserActivity(feature.id? feature.id:feature.description, 'User fetched by ID');
        // מחזיר את המשתמש שנמצא
        return feature;
}

//מחיקת פיצ'ר
 async deleteFeature(id: string) {
        const { error } = await supabase
            .from('room_feature')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting feature:', error);
            return false;
        }
        
       // logUserActivity(id, 'User deleted');
        // מחזיר true אם הפיצ'ר נמחק בהצלחה
        return true; 


}

}