
// core.d.ts

// ID type (string for UUIDs, or number for auto-increment)
export type ID = string;

// ISO Date string
export type DateISO = string;

// File reference model
export interface FileReference {
  id: ID;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  url: string;
  googleDriveId?: string;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Generic API response
export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Date range filter
export interface DateRangeFilter {
  startDate: DateISO;
  endDate: DateISO;
}

// Generic sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Generic filter options
export interface FilterOptions {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}
