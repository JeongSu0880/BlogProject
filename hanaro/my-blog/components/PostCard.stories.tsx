import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Post } from '@/lib/generated/prisma/client';
import PostCard from './PostCard';

const meta: Meta<typeof PostCard> = {
  title: 'Components/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PostCard>;

// 공통 mock 데이터
const basePost: Post = {
  id: 1,
  title: '게시글 제목 예시입니다',
  content: '이것은 게시글 내용의 미리보기입니다. 한 줄로 잘려서 표시됩니다.',
  likes: 12,
  readCnt: 345,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-05'),
  folder: 1,
};

export const Default: Story = {
  args: {
    ...basePost,
  },
};

export const LongTitle: Story = {
  args: {
    ...basePost,
    title:
      '아주아주아주아주아주아주아주 긴 게시글 제목입니다. UI가 어떻게 깨지는지 확인용',
  },
};

export const LongContent: Story = {
  args: {
    ...basePost,
    content:
      '내용이 아주 길 때 line-clamp가 제대로 동작하는지 확인하기 위한 스토리입니다. 이 문장은 계속 길어집니다. 계속 계속 계속…',
  },
};

export const NoLikes: Story = {
  args: {
    ...basePost,
    likes: 0,
  },
};

export const HighReadCount: Story = {
  args: {
    ...basePost,
    readCnt: 12345,
  },
};
