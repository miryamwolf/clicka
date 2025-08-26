export const supportedLanguages = ['en', 'fr', 'de', 'es', 'ar'] as const;
export type Language = typeof supportedLanguages[number];
