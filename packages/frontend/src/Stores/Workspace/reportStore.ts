import { create } from 'zustand';
import axios from "axios";
import { DateRangeFilter, WorkspaceType } from 'shared-types';
import { SpaceAssign } from 'shared-types/spaceAssignment';

interface ReportState {
  report: SpaceAssign[];
  count: number;
  occupancyRate: number;
  // CRUD actions
 getOccupancyReport: (type: WorkspaceType, dateRange: DateRangeFilter) => Promise<{
    count: number;
    data: SpaceAssign[];
    occupancyRate: number;
}>;
}
export const useReportStore = create<ReportState>((set, get) => ({
report: [],
count: 0,
occupancyRate: 0,
  getOccupancyReport: async (type,dateRange) => {
  
    try {
      const response = await axios.get(`api/space/getOccupancyReport/${type}/${dateRange.startDate}/${dateRange.endDate}`)
      
      set({report: response.data.data, count: response.data.count, occupancyRate: response.data.occupancyRate});
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy report:', error);
      throw error;
    }
  },
}));