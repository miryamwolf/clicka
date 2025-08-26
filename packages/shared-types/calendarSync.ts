import { ID, DateISO } from './core';
export interface CalendarSync {
    id?: ID;
    bookingId: ID;
    calendarId: string;
    lastSyncAt: DateISO;
    syncStatus: CalendarSyncStatus;
    syncErrors?: string[];
}

export enum CalendarSyncStatus {
    SYNCED = 'SYNCED',
    PENDING = 'PENDING',//ממתין לאישור
    FAILED = 'FAILED',
    CONFLICT = 'CONFLICT'
}

// export interface SyncBookingsWithGoogleRequest {
//     roomId?: ID;
//     startDate?: DateISO;
//     endDate?: DateISO;
//     forceSync?: boolean;
// }

export interface CalendarConflict {
    bookingId: ID;
    googleEventId: string;
    conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
    description: string;
    suggestedResolution: string;
}
