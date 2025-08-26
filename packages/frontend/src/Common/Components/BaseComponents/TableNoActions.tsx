import React from "react";
import clsx from "clsx";
import { useTheme } from "../themeConfig";

export interface BaseComponentProps {
  className?: string;
  dir?: 'rtl' | 'ltr';
  'data-testid'?: string;
  children?: React.ReactNode;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
}

export const TableNoActions = <T extends Record<string, any>>({
  columns,
  data,
  className,
  dir,
  "data-testid": testId,
}: TableProps<T>) => {
  const { theme } = useTheme();
  const effectiveDir = dir || theme.direction;

  return (
    <div dir={effectiveDir} data-testid={testId} className={clsx("overflow-x-auto", className)} role="region" aria-label="Table data">
      <table
        className={clsx(
          "min-w-full table-auto border border-gray-300 rounded text-sm",
          effectiveDir === "rtl" ? "text-right" : "text-left"
        )}
        style={{
          tableLayout: "fixed",
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      >
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={clsx("border px-4 py-2 font-semibold")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="border px-4 py-2">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor] ?? '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableNoActions;