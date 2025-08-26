import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import clsx from "clsx";
import { useTheme } from "../themeConfig";
interface FileInputFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  dir?: "rtl" | "ltr";
  className?: string;
  "data-testid"?: string;
  multiple?: boolean; //אפשרות להוספת הרבה קבצים 
  
}

export const FileInputField: React.FC<FileInputFieldProps> = ({
  name,
  label,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
  multiple = false,
}) => {
  const {theme} = useTheme();
  const {
    control, 
    //משתנה שמשתמשים בו כדי להביא את הCONTROLLER של REACT-HOOK 
    watch,//עוזר לי להסתכל על השינוים שבINPUT
    setValue,//מאפשר לשנות בצורה ידנית את הVALUE של הFORM
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;//זריקת הודעה של שגיאה 
  const effectiveDir = dir || theme.direction;

  const files = watch(name);
  // פה אנחנו מסתכלים על השינוים שבINPUT כדי לקבל את השינויים 

  // ✅ useEffect- משתמשים בו כדי להפוך את הקבצים למחרך ואם אין קבצים אז מביא לי מערך ריק 
  useEffect(() => {
    if (!files) {
      setValue(name, []); // אם אין קבצים שבחרו אותם משנה את ה למערך ריק 
    } else if (files instanceof FileList) {
      const fileArray = Array.from(files);
      // משתנה שבREACT-HOOK-FORM שיעזור לשנות את המערך למערך ריק 
      setValue(name, fileArray);
    }
  }, [files, name, setValue]);

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
      <Controller
      //הקונטרולר קורא את השם וונותנת לו גם אפשרות להיכנס לתוך הקומטרול ננותנים לו RENDER 
      //שזה איפה שמכניסים את מה שאנחנו רוצים קורא מה שרשום שם קורא גם לONCHANGE עושה ולידציות וזורק שגיאות 
        name={name}
        control={control}
        render={({ field }) => (
          <input
            ref = {field.ref}
            disabled={disabled}
            aria-required={required}
            aria-invalid={!!error}
            aria-label={label}
            data-testid={testId}
            type="file"
            multiple={multiple}
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
            onChange={(e) => {
              //לוקח את הקבצים הנבחרים מחליף את זה למערך ואז שומר את זה בFILE 
              const selectedFiles = e.target.files
                ? Array.from(e.target.files)
                : [];
              field.onChange(selectedFiles);
            }}
          />
        )}
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
