import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BlogStatView from './BlogStatView';

const meta: Meta<typeof BlogStatView> = {
  title: 'Components/BlogStat',
  component: BlogStatView,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof BlogStatView>;

export const Default: Story = {
  args: {
    totalVisitor: 1234,
    totalLikes: 89,
  },
};

export const ZeroStat: Story = {
  args: {
    totalVisitor: 0,
    totalLikes: 0,
  },
};

export const HighTraffic: Story = {
  args: {
    totalVisitor: 987654,
    totalLikes: 3210,
  },
};
