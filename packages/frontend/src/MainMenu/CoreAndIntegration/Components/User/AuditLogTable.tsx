// import React, { useEffect, useState } from "react";
// import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
// import { Button } from "../../../../Common/Components/BaseComponents/Button";
// import { AuditLogDetails } from "./AuditLogDetails";

// const AuditLogTable = () => {
//   // מצב לנתונים המקוריים
//   const [auditLogs, setAuditLogs] = useState<any[]>([]);
//   // מצב לנתונים אחרי סינון
//   const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
//   // מצב טעינה
//   const [loading, setLoading] = useState<boolean>(true);

//   // שדות סינון
//   const [emailFilter, setEmailFilter] = useState<string>("");
//   const [functionNameFilter, setFunctionNameFilter] = useState<string>("");
//   const [dateFilter, setDateFilter] = useState<string>("");

//   // סטייט להצגת פרטי לוג נבחר
//   const [selectedLog, setSelectedLog] = useState<any | null>(null);

//     /**
//    * פונקציה אסינכרונית לשליפת נתוני יומן הפעולות מהשרת
//    * בונה URL עם פרמטרי הסינון ושולחת בקשה לשרת
//    * 
//    * @param email - אימייל לסינון (אופציונלי)
//    * @param functionName - שם פונקציה לסינון (אופציונלי)
//    * @param date - תאריך לסינון בפורמט YYYY-MM-DD (אופציונלי)
//    */
//   const fetchAuditLogs = async (
//     email = "",
//     functionName = "",
//     date = ""
//   ) => {
//     // הפעלת מצב טעינה
//     setLoading(true);

//     try {
//       /**
//        * בניית פרמטרי הURL באמצעות URLSearchParams
//        * רק פרמטרים שיש להם ערך נוספים לבקשה
//        */
//       const queryParams = new URLSearchParams();

//       // הוספת פרמטרים רק אם יש להם ערך
//       if (email) queryParams.append("userEmail", email);
//       if (functionName) queryParams.append("functionName", functionName);

//       /**
//        * טיפול מיוחד בתאריך:
//        * המשתמש בוחר תאריך אחד, אך אנחנו רוצים לקבל את כל הפעולות של אותו יום
//        * לכן ממירים לטווח שלם: מתחילת היום עד סופו
//        */
//       if (date) {
//         queryParams.append("startDate", `${date}T00:00:00.000Z`); // 00:00:00 של היום
//         queryParams.append("endDate", `${date}T23:59:59.999Z`);   // 23:59:59 של היום
//       }

//       /**
//        * שליחת בקשת GET לשרת
//        * הURL כולל את כל פרמטרי הסינון
//        */
//       const response = await fetch(`/api/audit-logs/AuditLogController?${queryParams.toString()}`);

//       /**
//        * המרת התגובה לפורמט JSON
//        * השרת מחזיר מערך של אובייקטי AuditLog
//        */
//       const data = await response.json();

//       // עדכון ה-state עם הנתונים החדשים
//       setFilteredLogs(data);

//     } catch (error) {
//       /**
//        * טיפול בשגיאות רשת או עיבוד
//        * רישום השגיאה לקונסול ואיפוס הנתונים
//        */
//       console.error("Error fetching audit logs:", error);
//       setFilteredLogs([]); // מערך ריק במקרה של שגיאה

//     } finally {
//       /**
//        * תמיד לכבות את מצב הטעינה
//        * בין אם הבקשה הצליחה או נכשלה
//        */
//       setLoading(false);
//     }
//   };

//   /**
//    * Hook שמפעיל את fetchAuditLogs בכל שינוי בערכי הסינון
//    * זה מאפשר סינון בזמן אמת - כל הקלדה מפעילה חיפוש חדש
//    * 
//    * Dependencies: [emailFilter, functionNameFilter, dateFilter]
//    * כלומר הפונקציה תרוץ בכל שינוי באחד מהערכים האלה
//    */
//   useEffect(() => {
//     fetchAuditLogs(emailFilter, functionNameFilter, dateFilter);
//   }, [emailFilter, functionNameFilter, dateFilter]);

//   // הגדרת עמודות
//   const columns: TableColumn<any>[] = [
//     { header: "מייל משתמש", accessor: "userEmail" },
//     {
//       header: "תאריך ושעה", accessor: "timestamp",
//       /**
//        * פונקציית render מותאמת אישית להצגת התאריך
//        * ממירה את התאריך מפורמט ISO לפורמט ידידותי למשתמש
//        */
//       render: (value: string) => {
//         return new Date(value).toLocaleString('he-IL', {
//           year: 'numeric',    // שנה מלאה (2024)
//           month: '2-digit',   // חודש בשתי ספרות (01-12)
//           day: '2-digit',     // יום בשתי ספרות (01-31)
//           hour: '2-digit',    // שעה בשתי ספרות (00-23)
//           minute: '2-digit',  // דקות בשתי ספרות (00-59)
//           second: '2-digit'   // שניות בשתי ספרות (00-59)
//         });
//       }
//     },
//     { header: "איזה פעולה", accessor: "functionName" },
//     {
//       header: "לפרטים נוספים",
//       accessor: "",
//       render: (_: any, row: any) => (
//         <Button onClick={() => setSelectedLog(row)}>הצג ←</Button>
//       )
//     }
//   ];

//   if (loading) return <div>טוען נתונים...</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">פעולות משתמשים</h2>

//       {/* סינון */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="סינון לפי מייל"
//           value={emailFilter}
//           onChange={(e) => setEmailFilter(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="סינון לפי פעולה"
//           value={functionNameFilter}
//           onChange={(e) => setFunctionNameFilter(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="date"
//           placeholder="סינון לפי תאריך"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           className="border p-2 rounded"
//         />
//       </div>

//       {/* טבלה */}
//       <Table
//         columns={columns}
//         data={filteredLogs}
//         showActions={false}
//       />
//       {/* תצוגת פרטי לוג נבחר */}
//       {selectedLog && (
//         <AuditLogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
//       )}
//     </div>
//   );
// };

// export default AuditLogTable;



import React, { useEffect, useState } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { AuditLogDetails } from "./AuditLogDetails";
import { axiosInstance } from "../../../../Service/Axios";

const AuditLogTable = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // שדות סינון שנשלחים לשרת
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [functionNameFilter, setFunctionNameFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // שדות קלט מהמשתמש (אינם מפעילים מיד בקשת סינון)
  const [emailInput, setEmailInput] = useState<string>("");
  const [functionNameInput, setFunctionNameInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");

  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchAuditLogs = async (
    email = "",
    functionName = "",
    date = ""
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (email) queryParams.append("userEmail", email);
      if (functionName) queryParams.append("functionName", functionName);
      if (date) {
        queryParams.append("startDate", `${date}T00:00:00.000Z`);
        queryParams.append("endDate", `${date}T23:59:59.999Z`);
      }

      const response = await axiosInstance.get(`/audit-logs/AuditLogController?${queryParams.toString()}`);
      const data = response.data;

      setAuditLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // שליחת בקשת סינון כאשר ערכי הסינון הרשמיים משתנים (לא בזמן הקלדה)
  useEffect(() => {
    fetchAuditLogs(emailFilter, functionNameFilter, dateFilter);
  }, [emailFilter, functionNameFilter, dateFilter]);

  const columns: TableColumn<any>[] = [
    { header: "מייל משתמש", accessor: "userEmail" },
    {
      header: "תאריך ושעה",
      accessor: "timestamp",
          render: (value: string) => {
        // מוסיף 3 שעות לזמן UTC לקבלת זמן ישראלי
        const utcDate = new Date(value);
        const israelTime = new Date(utcDate.getTime() + (3 * 60 * 60 * 1000));
        
        return israelTime.toLocaleString('he-IL', {
          year: 'numeric',    // שנה מלאה (2024)
          month: '2-digit',   // חודש בשתי ספרות (01-12)
          day: '2-digit',     // יום בשתי ספרות (01-31)
          hour: '2-digit',    // שעה בשתי ספרות (00-23)
          minute: '2-digit',  // דקות בשתי ספרות (00-59)
          second: '2-digit'   // שניות בשתי ספרות (00-59)
        });
      }},

    { header: "איזה פעולה", accessor: "functionName" },
    {
      header: "לפרטים נוספים",
      accessor: "",
      render: (_: any, row: any) => (
        <Button onClick={() => setSelectedLog(row)}>הצג ←</Button>
      )
    }
  ];

  if (loading) return <div>טוען נתונים...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">פעולות משתמשים</h2>

      {/* סינון */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
  <input
    type="text"
    placeholder="סינון לפי מייל"
    value={emailInput}
    onChange={(e) => setEmailInput(e.target.value)}
    className="border p-2 rounded"
  />

  <input
    type="text"
    placeholder="סינון לפי פעולה"
    value={functionNameInput}
    onChange={(e) => setFunctionNameInput(e.target.value)}
    className="border p-2 rounded"
  />

  <input
    type="date"
    value={dateInput}
    onChange={(e) => setDateInput(e.target.value)}
    className="border p-2 rounded"
  />

  <Button
    onClick={() => {
      setEmailFilter(emailInput);
      setFunctionNameFilter(functionNameInput);
      setDateFilter(dateInput);
    }}
  >
    סנן
  </Button>
</div>

      {/* טבלה */}
      <Table
        columns={columns}
        data={auditLogs}
        showActions={false}
      />

      {/* תצוגת פרטים */}
      {selectedLog && (
        <AuditLogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};

export default AuditLogTable;