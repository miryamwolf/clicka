import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { useTheme } from "../themeConfig";
interface InputFieldProps {
  name: string;
  label: string;
  required?: boolean;
  value?: string | number;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  className?: string;
  "data-testid"?: string;
  type?: React.HTMLInputTypeAttribute; // טיפוס של הכנסת נתונים שיעזור לנו להעלות קבצים
  defaultValue?: string | number; //שיהיה ערך התחלתי להגדרות
  placeholder?: string; //שיראי משהו לפני שמכניסים כיתוב
  // multiple?: boolean; //הוספת הרבה קבצים
}
export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
  type = "text",
  defaultValue,
  placeholder,
  // multiple,
}) => {
  const {theme} = useTheme();
  const {
    register, //ה מה שמקשר את הINPUT ונותן את האפשרות לעשות ולידציות, לבדוק שינויים, מכניס את זה לתוך הסובמיט
    formState: { errors }, //מגדיר את כל השדיעות לדוג אם יש לי שגיעה בשם אז יעשה לי ERROR.NAME.MESSAGE ויזרוק את השגיעה
    // זה השימוש של REACT-HOOK כדי שאני לא יצטרך להעביר את כל הPROPS בצורה ידיני מביא לי אותם ככה
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const effectiveDir = dir || theme.direction;
  return (
    <div className="space-y-1 w-full" dir={effectiveDir}>
      <label
        className="block text-sm font-medium text-gray-700"
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        //זה אופציה של HOOK שבא מחזיר את כל הPROPS הפנימיים שיש לINPUT לדוג ONCHANGE,ONBLUR ועוד
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-label={label}
        data-testid={testId}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        // multiple={multiple && type === "file"}
        className={clsx(
          "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition",
          error
            ? `border-[${theme.colors.semantic.error}] focus:ring-[${theme.colors.semantic.error}]`
            : `border-gray-300 focus:ring-[${theme.colors.primary}]`,
          className
        )}
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      />
      {error && (
        <p
          className="text-sm"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          style={{ color: theme.colors.semantic.error }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
//הסבר מפורש בבקומפוננטה של הFORM---הכל כמעט אותו דבר, אם יש שאלות אפשר לבדוק שם
