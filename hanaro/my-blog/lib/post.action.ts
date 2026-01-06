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

export const updatePost = async ({ id, ...post }: IdRequired<Post>) => {
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
  folderId: number;
  title: string;
  content: string;
}) => {
  const { folderId, title, content } = input;

  await prisma.post.create({
    data: {
      title,
      content,
      Folder: {
        connect: { id: folderId },
      },
    },
  });
};
