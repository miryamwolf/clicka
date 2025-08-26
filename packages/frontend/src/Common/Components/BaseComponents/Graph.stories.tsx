import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChartDisplay } from './Graph';

const meta: Meta<typeof ChartDisplay> = {
  title: 'BaseComponents/Graph',
  component: ChartDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'line', // בחר את סוג הגרף (קו, עמודות, עוגה)
    data: [        // הוסף כאן נתונים לדוגמה
      { label: 'Jan', value: 400 },
      { label: 'Feb', value: 500 },
      { label: 'Mar', value: 300 },
      { label: 'Apr', value: 700 },
      { label: 'May', value: 900 },
      { label: 'Jun', value: 800 },
    ],
    rtl: true,     // כיוון ימין לשמאל (אופציונלי)
  },
};
