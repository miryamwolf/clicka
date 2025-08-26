import React from "react";

// טיפוס (interface) שמגדיר את הפרופס (props) שמקבל הקומפוננט
interface AuditLogDetailsProps {
  log: {
    id: string;              // מזהה ייחודי של הלוג
    userEmail: string;       // האימייל של המשתמש שביצע את הפעולה
    timestamp: string;       // מתי הפעולה בוצעה בפועל
    functionName: string;    // שם הפונקציה או הפעולה שבוצעה
    targetInfo?: string;     // מידע נוסף על היעד של הפעולה (אופציונלי)
    createdAt: string;       // מתי הלוג נוצר במערכת
    updatedAt: string;       // מתי הלוג עודכן לאחרונה
  };
  onClose: () => void;        // פונקציה לסגירת המודאל
}

// פונקציית עזר שממירה תאריך למחרוזת קריאה בעברית, או מחזירה "-" אם לא קיים
const formatDateTime = (value: string | undefined) =>
  value ? new Date(value).toLocaleString("he-IL") : "-";

// קומפוננטה להצגת פרטי לוג (מודאל שמופיע מעל המסך)
export const AuditLogDetails: React.FC<AuditLogDetailsProps> = ({ log, onClose }) => {
  // אם אין לוג — לא להציג כלום
  if (!log) return null;

  return (
    // רקע כהה שמכסה את כל המסך
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {/* הקופסה המרכזית עם הפרטים */}
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh] relative text-right">
        
        {/* כפתור סגירה בצד שמאל למעלה */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-lg font-bold text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        {/* כותרת הקופסה */}
        <h3 className="text-2xl font-bold mb-4 text-blue-700">פרטי פעולה</h3>

        {/* הצגת פרטי הלוג */}
        <div className="space-y-2">
          <div><b>מזהה:</b> {log.id}</div>
          <div><b>אימייל משתמש:</b> {log.userEmail || "-"}</div>
          <div><b>שם פעולה:</b> {log.functionName || "-"}</div>
          <div><b>זמן פעולה:</b> {formatDateTime(log.timestamp)}</div>
          <div><b>נוצר בתאריך:</b> {formatDateTime(log.createdAt)}</div>
          <div><b>עודכן בתאריך:</b> {formatDateTime(log.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};
