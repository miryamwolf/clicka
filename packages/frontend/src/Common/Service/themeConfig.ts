
export interface ThemeConfig {
  isKeyboardNavigation:boolean, 
    lang: "en" | "he",
  isHighContrast: boolean,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    text:string
  };

  typography: {
    fontFamily: {
      hebrew: string;
      latin: string;
    };
    sizes: string[];
  };
  spacing: number[];
  direction: 'rtl' | 'ltr';
}



