// import { Language, supportedLanguages, Translation } from "shared-types";
// import { baseService } from "./baseService";
// import { translateText } from "../utils/translate";



// function isLanguage(value: string): value is Language {
//   return supportedLanguages.includes(value as Language);
// }

// class TranslationService extends baseService<Translation> {
//   constructor() {
//     super('translations'); // שם הטבלה בבסיס הנתונים
//   }

//   async createWithTranslations(base: { key: string; text: string; lang: Language }) {
//     const { key, text, lang } = base;
    
//     // const existing = await this.getByKey(key);
//     const langsToTranslate = supportedLanguages.filter(l => l !== lang);

//     const newTranslations: Translation[] = [];

//     for (const targetLang of langsToTranslate) {
//       // const alreadyExists = existing.find(e => e.lang === targetLang);
//       // if (alreadyExists) continue; // דילוג אם כבר קיים

//       const translatedValue = await translateText(text, lang, targetLang);
       
//       const translation: Translation = {
//         id: uuid(),
//         key,
//         lang: targetLang,
//         text: translatedValue,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       newTranslations.push(translation);
//     }

//     // נוסיף את המקורי אם גם הוא לא קיים
//     // const selfExists = existing.find(e => e.lang === lang);
//     // if (!selfExists) {
//     //   newTranslations.push({
//     //     id: uuid(),
//     //     key,
//     //     lang,
//     //     text: text,
//     //     createdAt: new Date().toISOString(),
//     //     updatedAt: new Date().toISOString(),
//     //   });
//     // }

//     // שמירה
//     await Promise.all(newTranslations.map(t => this.post(t)));
//     // שמירה

  
// }
// export const translationService = new TranslationService();



