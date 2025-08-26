import { useState, useCallback, useRef, useEffect } from "react";

interface ScreenReaderHook {
  isScreenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
  isReading: boolean;
  stopReading: () => void;
}

export const useScreenReader = (): ScreenReaderHook => {
  const [isScreenReaderMode, setIsScreenReaderMode] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // הוספת useEffect לניהול event listeners
  useEffect(() => {
    if (isScreenReaderMode) {
      addReadingEventListeners();
    } else {
      removeReadingEventListeners();
    }

    // cleanup function
    return () => {
      removeReadingEventListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenReaderMode]);

  const isSpeechSupported = (): boolean => {
    return 'speechSynthesis' in window;
  };

  const toggleScreenReaderMode = useCallback((): void => {
    if (!isSpeechSupported()) {
      alert('הדפדפן שלך לא תומך בקריאת טקסט. אנא השתמש בדפדפן מעודכן.');
      return;
    }

    const newMode: boolean = !isScreenReaderMode;
    setIsScreenReaderMode(newMode);
    
    if (newMode) {
      enableScreenReaderMode();
    } else {
      disableScreenReaderMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenReaderMode]);

  const speak = (text: string, options?: { rate?: number; pitch?: number; volume?: number }): void => {
    console.log('Trying to speak:', text);
    
    if (!speechSynthesisRef.current || !text.trim()) {
      console.log('Cannot speak - no synthesis or empty text');
      return;
    }

    // עצירת קריאה נוכחית
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // הגדרות קול
    utterance.lang = 'he-IL';
    utterance.rate = options?.rate || 0.8;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    // חיפוש קול עברי
    const voices = speechSynthesisRef.current.getVoices();
    const hebrewVoice = voices.find(voice => voice.lang.includes('he')) || 
                       voices.find(voice => voice.lang.includes('ar')) || 
                       voices[0];
    
    if (hebrewVoice) {
      utterance.voice = hebrewVoice;
    }

    // event listeners
    utterance.onstart = () => {
      console.log('Speech started');
      setIsReading(true);
    };
    utterance.onend = () => {
      console.log('Speech ended');
      setIsReading(false);
    };
    utterance.onerror = (error) => {
      console.log('Speech error:', error);
      setIsReading(false);
    };

    currentUtteranceRef.current = utterance;
    speechSynthesisRef.current.speak(utterance);
    console.log('Speech command sent');
  };

  const stopReading = (): void => {
    console.log('Stopping reading');
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsReading(false);
      currentUtteranceRef.current = null;
    }
  };

  const enableScreenReaderMode = (): void => {
    console.log('Enabling screen reader mode');
    speechSynthesisRef.current = window.speechSynthesis;
    
    // הודעה קולית
    speak('מצב קריאת האתר הופעל. לחץ על כל אלמנט כדי לשמוע אותו.');
  };

  const disableScreenReaderMode = (): void => {
    console.log('Disabling screen reader mode');
    
    // עצירת קריאה נוכחית
    stopReading();
    
    speak('מצב קריאת האתר בוטל.');
  };

  const addReadingEventListeners = (): void => {
    console.log('Adding reading event listeners');
    
    // הסרת listeners קיימים לפני הוספה
    removeReadingEventListeners();
    
    // קריאה בלחיצה על אלמנטים
    document.body.addEventListener('click', handleElementClick, true);
    
    // קריאה בניווט מקלדת
    document.body.addEventListener('focus', handleElementFocus, true);
    
    // קריאה בהעברת עכבר (אופציונלי)
    document.body.addEventListener('mouseenter', handleElementHover, true);
    
    console.log('Event listeners added to body');
  };

  const removeReadingEventListeners = (): void => {
    console.log('Removing reading event listeners');
    document.body.removeEventListener('click', handleElementClick, true);
    document.body.removeEventListener('focus', handleElementFocus, true);
    document.body.removeEventListener('mouseenter', handleElementHover, true);
  };

  const handleElementClick = (event: Event): void => {
    console.log('🔥 CLICK EVENT TRIGGERED!', event.target);
    
    if (!isScreenReaderMode) {
      console.log('Screen reader mode is OFF');
      return;
    }
    
    const target = event.target as HTMLElement;
    const textToRead = getElementText(target);
    console.log('Text to read:', textToRead);
    
    if (textToRead) {
      // עיכוב קטן כדי לא להפריע ללחיצה
      setTimeout(() => {
        speak(textToRead);
      }, 100);
    }
  };

  const handleElementFocus = (event: Event): void => {
    console.log('🔥 FOCUS EVENT TRIGGERED!', event.target);
    
    if (!isScreenReaderMode) return;
    
    const target = event.target as HTMLElement;
    const textToRead = getElementText(target);
    
    if (textToRead) {
      speak(textToRead);
    }
  };

  const handleElementHover = (event: Event): void => {
    if (!isScreenReaderMode) return;
    
    const target = event.target as HTMLElement;
    // רק אם האלמנט ניתן לפוקוס או לחיצה
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT') {
      console.log('🔥 HOVER EVENT TRIGGERED!', target);
      const textToRead = getElementText(target);
      if (textToRead) {
        speak(textToRead, { rate: 1.2 });
      }
    }
  };

  const getElementText = (element: HTMLElement): string => {
    console.log('Getting text for element:', element.tagName, element);
    
    // בדיקה לפי סוג האלמנט
    switch (element.tagName.toLowerCase()) {
      case 'button':
        const buttonText = element.textContent?.trim() || element.getAttribute('aria-label') || 'כפתור ללא תיאור';
        return `כפתור: ${buttonText}`;
      
      case 'a':
        const linkText = element.textContent?.trim() || element.getAttribute('aria-label') || 'קישור';
        return `קישור: ${linkText}`;
      
      case 'input':
        const input = element as HTMLInputElement;
        const label = document.querySelector(`label[for="${input.id}"]`)?.textContent?.trim() || 
                     input.getAttribute('placeholder') || 
                     input.getAttribute('aria-label') || 
                     'שדה קלט';
        return `שדה קלט: ${label}. ערך נוכחי: ${input.value || 'ריק'}`;
      
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        const headingLevel = element.tagName.charAt(1);
        return `כותרת רמה ${headingLevel}: ${element.textContent?.trim() || 'כותרת ריקה'}`;
      
      case 'p':
        const pText = element.textContent?.trim();
        return pText ? `פסקה: ${pText}` : '';
      
      case 'div':
      case 'span':
        const text = element.textContent?.trim();
        // רק אם יש טקסט ולא יותר מדי ארוך
        if (text && text.length > 0 && text.length < 200) {
          return text;
        }
        return '';
      
      default:
        const defaultText = element.textContent?.trim();
        if (defaultText && defaultText.length > 0 && defaultText.length < 200) {
          return defaultText;
        }
        return '';
    }
  };

  return {
    isScreenReaderMode,
    toggleScreenReaderMode,
    isReading,
    stopReading,
  };
};