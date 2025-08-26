import React from "react";
import clsx from "clsx";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  DefaultValues,

} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { useTheme } from "../themeConfig";
import { useTranslation } from "react-i18next";

export interface BaseComponentProps {
  className?: string;
  dir?: "rtl" | "ltr";
  "data-testid"?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps<T extends FieldValues> extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  schema?: ZodType<T>;
  onSubmit: SubmitHandler<T>;
  methods?: UseFormReturn<T>;
  defaultValues?: Partial<T>; // הוספת התמיכה ב-defaultValues
}

export function Form<T extends FieldValues>({
  label,
  schema,
  onSubmit,
  className,
  dir,
  "data-testid": testId,
  children,
  methods: externalMethods,
  defaultValues, // קבלת הפרופ החדש
}: FormComponentProps<T>) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const effectiveDir = dir || theme.direction;

const internalMethods = useForm<T>({
  ...(schema ? { resolver: zodResolver(schema) } : {}),
  mode: "onSubmit",
  ...(defaultValues ? { defaultValues: defaultValues as DefaultValues<T> } : {}),
});
  const methods: UseFormReturn<T> = externalMethods ?? internalMethods;

  return (
    <FormProvider {...methods}>

      <form
        dir={effectiveDir}
        data-testid={testId}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded shadow-md w-full max-w-4xl",
          effectiveDir === "rtl" ? "text-right" : "text-left",
          className
        )}
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
        // role="form"

        aria-label={label ? t(label) : undefined}
      >

        {label && (
          <h2
            className="text-xl font-semibold mb-4 col-span-full"
            style={{
              color: theme.colors.primary,
            }}
            tabIndex={-1}
          >

            {t(label)}

          </h2>
        )}

        {methods.formState.errors.root && (
          <div

            className="text-red-600 text-sm mb-2 col-span-full"
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            style={{
              color: theme.colors.semantic.error,

            }}
          >
            {methods.formState.errors.root.message}
          </div>
        )}


        {children}
      </form>
    </FormProvider>
  );
}