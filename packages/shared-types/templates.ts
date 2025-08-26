import { ID, DateISO } from './core';

export interface EmailTemplate {
  id?: ID;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  language: 'he' | 'en';
  variables: string[];
  createdAt: DateISO;
  updatedAt: DateISO;
}
