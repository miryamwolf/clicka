// מייבא טיפוסים חיוניים מ־storybook לתיאור מטה־נתונים וסיפורים (stories)
import { Meta, StoryObj } from '@storybook/react-webpack5';

// מייבא את הקומפוננטה שאנחנו רוצים להציג ב־Storybook
import { Accesibility } from './Accesibility';

// מגדיר את המטא־דאטה של הסיפור: כותרת להצגה בעץ הרכיבים, הרכיב עצמו, ותוויות
const meta: Meta<typeof Accesibility> = {
  // מיקום הקומפוננטה במבנה התיקיות של Storybook
  title: 'BaseComponents/Accesibility',

  // הקומפוננטה ש־Storybook הולך להציג ולתעד
  component: Accesibility,

  // תגים עבור תיעוד אוטומטי – מאפשרים ל־Storybook להוסיף תיעוד באופן אוטומטי
  tags: ['autodocs'],
};

// מייצא את המטא־דאטה כברירת מחדל – חיוני ש־Storybook יזהה את הסיפור
export default meta;

// מגדיר טיפוס עבור סיפורים (story instances) המבוססים על המטא־דאטה
type Story = StoryObj<typeof meta>;

// מגדיר את הגרסה הבסיסית של הקומפוננטה – איך היא תוצג כברירת מחדל ב־Storybook
export const Default: Story = {
  // כאן ניתן להגדיר ערכי props ברירת מחדל, כרגע הקומפוננטה מוצגת עם ברירת המחדל הפנימית שלה
  args: {},
};
