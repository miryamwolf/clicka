// ייבוא React (כולל טיפוסי FC)
import React from 'react';


// ייבוא רכיבי גרפים מהספרייה Recharts
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
// ייבוא קריאת ערכת עיצוב (theme) מתוך hook פנימי
import { useTheme } from '../themeConfig';
import { formatDateIL, formatNumberIL } from '../../Service/FormatHebrew';

// טיפוס עבור הנתונים שכל גרף יקבל (label לציר X, value לערך המספרי)
export interface ChartData {
  label: string;        // תווית – קטגוריה בציר X או שם פרוסת עוגה
  value: number;        // ערך מספרי להצגה
  [key: string]: any;   // תמיכה בשדות נוספים אופציונליים
}

// טיפוס עבור פרופסים של קומפוננטת הגרף
interface ChartDisplayProps {
  
  type: 'line' | 'bar' | 'pie'; // סוג הגרף: קו / עמודות / עוגה
  data: ChartData[];            // הנתונים להצגה
  title?: string;               // כותרת אופציונלית לגרף
  rtl?: boolean;                // האם הכיוון הוא ימין לשמאל (ברירת מחדל: true)
  color?: string;
  onClickLabel?: (label: string) => void;            // צבע אופציונלי (אם לא – נשלוף מ־theme)
}

// קומפוננטת ChartDisplay – מציגה גרף לפי סוג שנבחר
export const ChartDisplay: React.FC<ChartDisplayProps> = ({ type, data, rtl = true, onClickLabel }) => {
  const { theme: { colors } } = useTheme(); // שליפת צבעים מה־theme (צבעים אחידים לגרפים)
  console.log(data);
  
  // מערך צבעים לפרוסות גרף עוגה
  const COLORS = [colors.primary, colors.secondary, colors.accent];

  return (
    // עטיפת הגרף עם כיוון הטקסט בהתאם ל־RTL
    
    <div dir={rtl ? 'rtl' : 'ltr'} >
      {/* עטיפה רספונסיבית שתתאים את הגרף לגודל האלמנט ההורה */}
      <ResponsiveContainer width="100%" height={300}>

        {/* גרף מסוג קו (LineChart) */}
        {type === 'line' ? (
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}

          >
            <CartesianGrid strokeDasharray="3 3" /> {/* רשת רקע עם קווים מקווקווים */}
            <XAxis dataKey="label" reversed={rtl} /> {/* ציר X – שם הקטגוריות */}
            <YAxis /> {/* ציר Y – ערכים מספריים */}
            <Tooltip
              formatter={(value: number) => formatNumberIL(value)}
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return date ? formatDateIL(date) : '';
              }}
            /> {/* חלונית מידע כאשר מרחפים */}
            <Line
              type="monotone" // סוג הקו – עקומה חלקה
              dataKey="value" // הערך להצגה
              stroke={colors.primary} // צבע קו
              onClick={(data: any) => {
                if (onClickLabel && data && data.payload && data.payload.label) {
                  onClickLabel(data.payload.label);
                }
              }}
            />
          </LineChart>

          // גרף מסוג עמודות (BarChart)
        ) : type === 'bar' ? (
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}

          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" reversed={rtl} />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatNumberIL(value)}
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return date ? formatDateIL(date) : '';
              }}
            />
            <Bar
              dataKey="value"
              fill={colors.primary}
              onClick={(data: any) => {
                if (onClickLabel && data && data.payload && data.payload.label) {
                  onClickLabel(data.payload.label);
                }
              }}
            /> {/* עמודות בצבע עיקרי */}
          </BarChart>

          // גרף מסוג עוגה (PieChart)
        ) : (
          <PieChart>
            <Tooltip
              formatter={(value: number) => formatNumberIL(value)}
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return date ? formatDateIL(date) : '';
              }}
            /> {/* חלונית מידע על פרוסה */}
            <Legend wrapperStyle={{ fontSize: '12px', padding: 30 }} /> {/* מקרא הצבעים */}

            <Pie
              data={data} // הנתונים
              dataKey="value" // שדה הערך
              nameKey="label" // שדה התווית
              cx="50%" // מיקום במרכז האופקי
              cy="50%" // מיקום במרכז האנכי
              outerRadius={100} // רדיוס פרוסות העוגה
              labelLine={false} // ביטול קו תוויות
              isAnimationActive={true} // הפעלת אנימציה
              label// תווית פרוסה
              onClick={(entry: any) => {
                if (onClickLabel && entry && entry.label) {
                  onClickLabel(entry.label);
                }
              }}
            >
              {/* עבור כל פרוסה בעוגה נבחר צבע מתוך COLORS */}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`} // מפתח ייחודי לכל פרוסה
                  fill={COLORS[index % COLORS.length]} // בחירת צבע לפי הסדר
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
