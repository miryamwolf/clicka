import { ID, DateISO } from '../shared-types/core';

// --- ENUMS ---
export enum StatusOccupancy {
  HIGH_OCCUPANCY = 'HIGH_OCCUPANCY',
  LOW_OCCUPANCY = 'LOW_OCCUPANCY',
  CAPACITY_REACHED = 'CAPACITY_REACHED',
}

export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export enum WorkSpaceType {
  // הוסיפי ערכים אם צריך
}

// --- INTERFACES ---
export interface OccupancyTrend {
  period: TimePeriod;
  roomId: string;
  customerId: string;
  date: string;
  occupancyRate: number;
  totalSpace: number;
  occupiedSpaces: number;
  averageOccupancy: number;
  peakOccupancy: number;
  lowOccupancy: number;
  growthRate: number;
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