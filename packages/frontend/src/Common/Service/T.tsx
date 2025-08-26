import { useEffect, useState, useContext } from "react";
import { fetchTranslations } from "./translationLoader";
import { LangContext } from "./langContext";

const cache: Record<string, string> = {};
const pending: Record<string, Promise<void>> = {};

export function T({ k }: { k: string }) {
  const lang = useContext(LangContext);
  const [text, setText] = useState(() => cache[`${lang}.${k}`] ?? null); // ← אם אין בטוח בקאש, נתחיל מ־null

 useEffect(() => {
  const key = `${lang}.${k}`;
  if (cache[key]) {
    setText(cache[key]);
    return;
  }
  if (!pending[key]) {
  
    pending[key] = fetchTranslations([k], lang).then((result) => {
      Object.entries(result).forEach(([subKey, value]) => {
        cache[`${lang}.${subKey}`] = value;
      });
    });
  }

  pending[key].then(() => {
    setText(cache[key]);
  });
}, [k, lang]);

  return <span>{text ?? k}</span>; // ← תצוגה ברירת מחדל
}
