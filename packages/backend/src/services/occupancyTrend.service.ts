import { createClient } from '@supabase/supabase-js';
import { OccupancyTrendModel } from '../models/occupancyTrend.model';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class OccupancyTrendService {
  async getAllTrends(): Promise<OccupancyTrendModel[] | null> {
    const { data, error } = await supabase.from('occupancy_trend').select('*');
    if (error) {
      console.error('Error fetching trends:', error);
      return null;
    }
    return OccupancyTrendModel.fromDatabaseFormatArray(data);
  }

  async getSnapshotReport(params: {
    workspaceType: string;
    startDate: string;
    endDate: string;
  }): Promise<OccupancyTrendModel[] | null> {
    const { workspaceType, startDate, endDate } = params;
    if (!workspaceType || !startDate || !endDate)
      throw new Error('Missing required fields: workspaceType, startDate, endDate');

    const { data, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .eq('workspace_type', workspaceType)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching snapshot report:', error);
      throw error;
    }

    return OccupancyTrendModel.fromDatabaseFormatArray(data);
  }

  async createTrend(trend: OccupancyTrendModel): Promise<OccupancyTrendModel | null> {
    console.log('📦 Inserting trend:', trend.toDatabaseFormat());
    const { data, error } = await supabase
      .from('occupancy_trend')
      .insert([trend.toDatabaseFormat()])
      .select()
      .single();


   if (error) {
  console.log('❌ Supabase Insert Error:', error); // ✅ הוספתי הדפסה מפורטת
throw new Error(`Failed to create trend: ${error.message}`);
   }
  const createdtrend =   OccupancyTrendModel.fromDatabaseFormat(data);
    //logUserActivity(book.id ?? book.roomName, 'book created');
    return createdtrend;
  
}

async updateTrend(id: string, updatedDataRaw: any): Promise<OccupancyTrendModel | null> {
    try {
        // המרה למופע של המחלקה
        const updatedData = OccupancyTrendModel.fromDatabaseFormat(updatedDataRaw);

        const { data, error } = await supabase
            .from('occupancy_trend')
            .update([updatedData.toDatabaseFormat()])
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating trend:', error);
            return null;
        }

        const trend = OccupancyTrendModel.fromDatabaseFormat(data);
        return trend;
    } catch (err) {
        console.error('Failed to update trend:', err);
        return null;
    }
}
async exportOccupancyTrendToCSV(): Promise<string> {
    const { data, error } = await supabase.from('occupancy_trend').select('*');
    if (error) throw error;
    // כאן תוכל להמיר ל-CSV בפועל אם תצטרך
    return 'CSV Exported Successfully';
  }

  async archiveOldTrend(): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .lte('period.endDate', now);

    if (error) throw error;

    const oldTrends = data ?? [];
    if (oldTrends.length === 0) return 'No old trends to archive';

    const { error: insertErr } = await supabase
      .from('occupancy_trend_archive')
      .insert(oldTrends);
    if (insertErr) throw insertErr;

    const ids = oldTrends.map((t: any) => t.id);
    const { error: deleteErr } = await supabase
      .from('occupancy_trend')
      .delete()
      .in('id', ids);
    if (deleteErr) throw deleteErr;

    return 'Archived successfully';
  }

  async getHistory(date: Date): Promise<any[] | null> {
  const today = new Date();
  const dateStr = date.toISOString().split('T')[0];
  if (date < today) {
    // 1. שליפת מזהים מהעבר
    const { data: occupancyData, error: occupancyError } = await supabase
      .from('occupancy_trend')
      .select('workspaces')
      .eq('date', dateStr)
      .single();
    if (occupancyError) {
      console.error('Error fetching occupancy trend:', occupancyError);
      return null;
    }
    const workspaceIds: string[] = occupancyData?.workspaces ?? [];
    if (workspaceIds.length === 0) return [];
    // 2. שליפת רשומות מלאות מהקצאות לפי מזהים
    const { data: assignments, error: assignmentsError } = await supabase
      .from('space_assignment')
      .select('*')
      .in('id', workspaceIds)
      .eq('assigned_date', dateStr);
    if (assignmentsError) {
      console.error('Error fetching assignments by IDs:', assignmentsError);
      return null;
    }
    return assignments ?? [];
  } else {
    // תאריך עתידי – שליפה ישירה לפי date
    const { data, error } = await supabase
      .from('space_assignment')
      .select('*')
      .eq('assigned_date', dateStr);
    if (error) {
      console.error('Error fetching future assignments:', error);
      return null;
    }
    return data ?? [];
  }
}

  async calculateClientOccupancyTrend(customerId: string): Promise<{
    customerId: string;
    averageOccupancy: number;
    totalSnapshots: number;
  }> {
    const { data, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .eq('customerId', customerId);

    if (error) throw error;
    const total = data.length;
    const avg =
      data.reduce((sum: number, s: any) => sum + s.occupancyRate, 0) / total;

    return {
      customerId,
      averageOccupancy: avg,
      totalSnapshots: total,
    };
  }

  async calculateOccupancyRate(id: string): Promise<{
    id: string;
    calculatedOccupancyRate: number;
  }> {
    const { data, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const rate =
      data.data.reduce((sum: number, item: any) => sum + item.occupancyRate, 0) /
      data.data.length;

    return {
      id,
      calculatedOccupancyRate: rate,
    };
  }
   async  deleteTrend(id:string) {
              const { error } = await supabase
              .from('occupancy_trend')
              .delete()
              .eq('id', id);
  
          if (error) {
              console.error('Error deleting trend:', error);
              return false;
          }
          
         
          return true; 
  }

  async  getTrendById(id:string) {
           const { data, error } = await supabase
                  .from('occupancy_trend')
                  .select('*')
                  .eq('id', id)
                  .single();
      
              if (error) {
                  console.error('Error fetching trend:', error);
                  return null;
              }
      
               const trend =  OccupancyTrendModel.fromDatabaseFormat(data); 
           
             // logUserActivity(feature.id? feature.id:feature.description, 'User fetched by ID');
            
              return trend;
  }
  async integrateCustomer(customerId: string): Promise<any> {
    const { data, error } = await supabase
      .from('customers')
      .update({ integrated: true })
      .eq('id', customerId);
    if (error) throw error;
    return data;
  }

  async checkAndTriggerAlert(id: string): Promise<string> {
    const { data: trend, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!trend) throw new Error('Trend not found');

    if (!trend.roomId || !trend.customerId)
      throw new Error('Missing roomId or customerId in trend');

    if (trend.occupancyRate >= 0.8) {
      await supabase.from('occupancy_trend_alerts').insert([
        {
          roomId: trend.roomId,
          customerId: trend.customerId,
          type: 'HighOccupancy',
          threshold: 0.8,
          currentValue: trend.occupancyRate,
          workspaceType: trend.workspaceType,
          isActive: true,
          triggeredAT: new Date().toISOString(),
        },
      ]);
    }

    return 'Checked and triggered if needed';
  }

  async sendOccupancyAlert(id: string): Promise<string> {
    const { data: alert, error } = await supabase
      .from('occupancy_trend')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    if (alert.isActive) {
      console.log(`Sending alert for room ${alert.roomId}`);
    }

    return 'Alert sent';
  }
}


export default OccupancyTrendService;
