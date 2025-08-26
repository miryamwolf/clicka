// ייבוא טיפוסים של Storybook לרכיבים מסוג React
import { Meta, StoryObj } from '@storybook/react-webpack5';
// ייבוא הקומפוננטה של הטבלה שאותה מדגימים
import { Table } from './Table';

// הגדרת המטא-מידע עבור סטוריבוק – קובעת כיצד הרכיב יוצג בתיעוד
const meta: Meta<typeof Table> = {
  title: 'BaseComponents/Table', // הנתיב בתפריט של Storybook
  component: Table,              // הרכיב עצמו
  tags: ['autodocs'],            // מאפשר ל־Storybook ליצור דוקומנטציה אוטומטית
};

export default meta;

// הגדרת טיפוס הסיפור בעזרת המטא־דאטה
type Story = StoryObj<typeof meta>;

// ייצוא סיפור ברירת המחדל
export const Default: Story = {
  args: {
    // עמודות הטבלה – כל עמודה כוללת כותרת (header) ושם מזהה (accessor)
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
    ],
    // נתונים שיוצגו בטבלה – מערך של אובייקטים עם ערכים תואמים לעמודות
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ],
    // פונקציה שתופעל כאשר נלחץ כפתור "עדכון" עבור שורה
    onUpdate: (row: any) => console.log('Updating row', row),
    // פונקציה שתופעל כאשר נלחץ כפתור "מחיקה" עבור שורה
    onDelete: (row: any) => console.log('Deleting row', row),
  },
};
