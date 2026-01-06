'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function createCommentAction(formData: FormData) {
  const postId = Number(formData.get('postId'));
  const content = String(formData.get('content') || '').trim();

  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  if (!content) throw new Error('내용을 입력해주세요.');

  await prisma.comment.create({
    data: {
      post: postId,
      content,
      writer: Number(session.user.id),
    },
  });
}
