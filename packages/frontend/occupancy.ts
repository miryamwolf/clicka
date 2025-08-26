import { ID, DateISO } from '../shared-types/core';

export enum StatusOccupancy {
  HIGH_OCCUPANCY = 'HIGH_OCCUPANCY',
  LOW_OCCUPANCY = 'LOW_OCCUPANCY',
  CAPACITY_REACHED = 'CAPACITY_REACHED',
}

export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export enum WorkSpaceType {
  // הוסיפי ערכים אם יש לך
}

export interface OccupancyAlert {
  id: ID;
  roomId: string;
  customerId: string;
  type: StatusOccupancy;
  threshold: number;
  currentValue: number;
  workspaceType: WorkSpaceType;
  isActive: boolean;
  triggeredAt: DateISO;
}

export interface OccupancyTrend {
  period: TimePeriod;
  roomId: string;
  customerId: string;
  data: {
    date: string;
    occupancyRate: number;
    totalSpace: number;
    occupiedSpaces: number;
  }[];
  summary: {
    averageOccupancy: number;
    peakOccupancy: number;
    lowOccupancy: number;
    growthRate: number;
  };
}