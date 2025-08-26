import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeConfig } from '../Service/themeConfig';

// ברירת מחדל
export const defaultTheme: ThemeConfig = {
  isKeyboardNavigation: false, 
  lang: "en",
  isHighContrast: false,
  colors: {
    primary: '#2563EB', // כחול
    secondary: '#F59E0B', // זהב
    accent: '#64748B', // אפור
    neutral: ['#F3F4F6', '#E5E7EB'],
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    text: '#000000',
  },
  typography: {
    fontFamily: {
      hebrew: `'Noto Sans Hebrew', sans-serif`,
      latin: `'Inter', sans-serif`,
    },
    sizes: ['text-sm', 'text-base', 'text-lg'],
  },
  spacing: [4, 8, 16, 32],
  direction: 'rtl',
};

// יצירת הקונטקסט עם טיפוס הכולל theme ו‑setTheme
type ThemeContextType = {
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {
  throw new Error("setTheme called outside of ThemeProvider");
},
});

// ✅ 3.  לכל המחלקות האחרות שאח"כ נוכל להשתמש עם פרוויידר 
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// משמש את הקונטקסט שיצרתי 
export const useTheme = () => useContext(ThemeContext);
