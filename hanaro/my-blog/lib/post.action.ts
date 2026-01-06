'use server';

import type { IdRequired } from './folder.action';
import type { Post } from './generated/prisma/client';
import { prisma } from './prisma';

export const deletePost = async (id: number) => {
  await prisma.post.delete({
    where: {
      id: id,
    },
  });
};

export const updatePost = async ({
  id,
  folderTitle,
  ...post
}: IdRequired<Post> & {
  folderTitle?: string;
}) => {
  const data = Object.fromEntries(
    Object.entries(post).filter(([, v]) => v !== undefined),
  );

  try {
    console.log('updatePost called with', { id, data });
    await prisma.post.update({
      where: { id },
      data,
    });
    console.log('updatePost succeeded', { id });
  } catch (err) {
    console.error('updatePost failed', err);
    throw err;
  }
};

export const createPost = async (input: {
  folderTitle: string;
  title: string;
  content: string;
}) => {
  const { folderTitle, title, content } = input;

  await prisma.post.create({
    data: {
      title,
      content,
      Folder: {
        connect: { title: folderTitle },
      },
    },
  });
};

export const togglePostLike = async (formData: FormData) => {
  const postId = Number(formData.get('postId'));
  const { auth } = await import('./auth');
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  try {
    const userId = Number(session.user.id);

    const existing = await prisma.postLike.findFirst({
      where: { user: userId, post: postId },
    });

    let liked = false;
    if (existing) {
      // remove like
      await prisma.postLike.deleteMany({
        where: { user: userId, post: postId },
      });
      liked = false;
    } else {
      await prisma.postLike.create({ data: { user: userId, post: postId } });
      liked = true;
    }

    const count = await prisma.postLike.count({ where: { post: postId } });

    return { liked, count } as const;
  } catch (err) {
    console.error('togglePostLike error:', err);
    throw err;
  }
};
