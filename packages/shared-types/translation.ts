// translation-types.d.ts

import { ID, DateISO } from './core';
import { Language } from './language';

/**
 * רשומת תרגום בודדת
 */
export interface Translation {
  id: ID;
  key: string;           // מזהה ייחודי למחרוזת (כגון: 'menu.dashboard')
  en: string;        // שפת התרגום (לדוגמה: 'he', 'en')
  he: string;          // המחרוזת המתורגמת
  createdAt: DateISO;
  updatedAt: DateISO;
}

/**
 * בקשה להוספת תרגום חדש
 */
export interface CreateTranslationRequest {
  key: string;
  lang: Language;
  text: string;
  context?: string;
}

/**
 * בקשה לעדכון תרגום קיים
 */
export interface UpdateTranslationRequest {
  text?: string;
  context?: string;
}

/**
 * בקשה לשליפת תרגומים עם סינון
 */
export interface GetTranslationsRequest {
  key?: string;
  lang?: Language;
  search?: string; // חיפוש חלקי בטקסטים
  page?: number;
  limit?: number;
  sortBy?: 'key' | 'lang' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}
