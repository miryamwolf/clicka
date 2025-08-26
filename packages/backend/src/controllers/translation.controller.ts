import { Request, Response } from "express";
import { translationService } from "../services/translation.service";

export const translationController = {
  getTranslationFile: async (req: Request, res: Response) => {
  const { lng, ns } = req.params;
  const keys = req.query.keys?.toString().split(',') || [];  // קבלת המפתחות מתוך query params

  if (keys.length === 0) {
    return res.status(400).json({ error: 'No translation keys provided' });
  }

  try {
    const existingTranslations = await translationService.getByLang(lng);
    console.log(`Existing translations for ${lng}:`, existingTranslations);
    
    const existingMap = new Map(existingTranslations.map((t) => [t.key, lng === 'he' ? t.he : t.en]));
    console.log(`Existing translations map for ${lng}:`, existingMap);
    
    const finalTranslations: Record<string, string> = {};

    // חיפוש מפתחות חסרים
    const missingKeys = keys.filter(key => !existingMap.has(key));

    for (const key of keys) {
      if (existingMap.has(key)) {
        finalTranslations[key] = existingMap.get(key)!;
      } else {
        // אם המפתח חסר, ניצור אותו
        const baseText = key;  // אפשר לקחת אותו מהמפתח עצמו או מטקסט אחר
        const newTranslation = await translationService.createWithTranslations({
          key,
          text: baseText,
          lang: lng,  // ברירת המחדל
        });

        finalTranslations[key] = lng === 'he' ? newTranslation[0]?.he ?? '' : newTranslation[0]?.en ?? '';
      }
    }

    res.json(finalTranslations);  // מחזירים את כל התרגומים
  } catch (error: any) {
    console.error('Error loading translation file:', error);
    res.status(500).json({ error: 'Failed to load translations' });
  }
}
,
  create: async (req: Request, res: Response) => {
    try {
      const newItem = await translationService.createWithTranslations(req.body);
      return res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
