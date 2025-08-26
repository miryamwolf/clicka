import { Meta, StoryObj } from '@storybook/react-webpack5';
import { showAlert } from './ShowAlert';

type AlertArgs = {
  title: string;
  text: string;
  icon: 'success' | 'error' | 'info' | 'warning';
};

const meta: Meta = {
  title: 'BaseComponents/ShowAlert',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AlertArgs>;

export const Default: Story = {
  render: (args) => (
    <button onClick={() => showAlert(args.title, args.text, args.icon)}>
      לחץ להצגת Alert
    </button>
  ),
  args: {
    title: 'שלום!',
    text: 'זהו Alert',
    icon: 'success',
  },
};
