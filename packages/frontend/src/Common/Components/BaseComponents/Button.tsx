import React from "react";
import clsx from "clsx";// מחבר רת הקלסס של CSS שיהיה יותר נקי
import { useTheme } from "../themeConfig";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    //שולחים כך את הכפתור כדי שיקבל את כל הדברים מהHTML כמו סובמיט, אונקליק וכו
  variant?: "primary" | "secondary" | "accent"; //משתמש בTHEME כדי להגדיר את הצבעים
  size?: "sm" | "md" | "lg"; // גודל של הכפתור
  dir?: "rtl" | "ltr"; // מגדיר את הכיוון
  "data-testid"?: string; //  בלי טעויות הוספה אופציונלית: כדי לאתר אותו יותר בקלות וביעילות
}
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",//מגדיר אותו בהתחלה עם הברירת מחדל שהגדרנו מקודם
  size = "md",
  dir,
  "data-testid": testId,
  type = "button", 
  ...props
}) => {
  const {theme} = useTheme();
//  const focusRingColor = theme.colors.semantic.info; //מגדיר את הצבע למתי שנעבור על הכפתורים בעזרת המקלדת יעשה לנו את הצבע הדרוש 
  const effectiveDir = dir || theme.direction; // או שלוקח את הכיוון שמבקשים או שלוקח מהTHEME את הכיוון של ברירת מחדל
  const color = theme.colors[variant];// אותו דבר כמו הכיוון
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  }; //מגדיר את הגדלים עם TAILWIND CSS
  return (
    <button
      dir={effectiveDir} 
      aria-label={typeof children === "string" ? children : undefined}
      //מתי שהטיפוס מסוג STRING משתמש בARIA 
      data-testid={testId}
      className={clsx(//מגדיר את העיצוב של הכפתור בצורה מסודרת
        "rounded focus:outline-none focus:ring-2 transition-colors font-semibold shadow-sm",
        `text-white hover:brightness-90`,  "focus:ring-[rgba(59,130,246,0.5)]",
        sizeClasses[size],
        effectiveDir === "rtl" ? "text-right" : "text-left",
        className
      )}
      style={{
      backgroundColor: color, 
      fontFamily:
        effectiveDir === "rtl"
          ? theme.typography.fontFamily.hebrew
          : theme.typography.fontFamily.latin,
    }} // מגדיר את הטיפוס של הכתב לפי הTHEME 
      {...props} // לוקח את כל ההגדרות של הבוטון 
    >
      {children} 
      {/* לוקח רת התוכן שיש בתוך הBUTTON  */}
    </button>
  );
};
// themeConfig.ts
export const theme = {
  direction: "rtl",
  colors: {
    primary: "#2563eb",      // כחול
    secondary: "#6b7280",    // אפור
    accent: "#dc2626",       // אדום למחיקה
  },
  typography: {
    fontFamily: {
      hebrew: "Assistant, sans-serif",
      latin: "Arial, sans-serif",
    },
  },
};
