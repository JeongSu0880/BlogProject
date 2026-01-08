'use server';

import { redirect } from 'next/navigation';
import type { IdRequired } from './folder.action';
import type { Post } from './generated/prisma/client';
import { prisma } from './prisma';

export async function deletePost(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Invalid id');

  await prisma.post.delete({
    where: {
      id: id,
    },
  });
  redirect('/admin');
}

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

export const likePost = async (
  prevState: { like: boolean; message: string },
  formData: FormData,
) => {
  const postId = Number(formData.get('postId'));
  const userId = Number(formData.get('userId'));

  console.log(postId, userId);

  if (!userId || !postId) {
    return prevState;
  }

  const existed = await prisma.postLike.findUnique({
    where: {
      user_post: {
        user: userId,
        post: postId,
      },
    },
  });

  if (existed) {
    const [, post] = await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          user_post: {
            user: userId,
            post: postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
        select: { likes: true },
      }),
    ]);

    return {
      like: false,
      message: `좋아요 ${post.likes}`,
    };
  } else {
    const [, post] = await prisma.$transaction([
      prisma.postLike.create({
        data: {
          user: userId,
          post: postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
        select: { likes: true },
      }),
    ]);

    return {
      like: true,
      message: `좋아요 ${post.likes}`,
    };
  }
};
