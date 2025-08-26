// translationStore.ts
type TranslationCache = {
  [lang: string]: {
    [key: string]: string;
  };
};

export const translationCache: TranslationCache = {};

export function cacheTranslation(lang: string, translations: Record<string, string>) {
  if (!translationCache[lang]) translationCache[lang] = {};
  Object.assign(translationCache[lang], translations);
}

export function getCached(lang: string, keys: string[]) {
  const cached: Record<string, string> = {};
  const missing: string[] = [];

  for (const key of keys) {
    if (translationCache[lang]?.[key]) {
      cached[key] = translationCache[lang][key];
    } else {
      missing.push(key);
    }
  }

  return { cached, missing };
}
