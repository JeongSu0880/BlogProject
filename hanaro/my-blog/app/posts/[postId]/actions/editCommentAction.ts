'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function editCommentAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const content = String(formData.get('content') || '').trim();

  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error('Comment not found');

  const currentUserId = Number(session.user.id);
  if (comment.writer !== currentUserId && !session.user.isAdmin) {
    throw new Error('권한이 없습니다.');
  }

  await prisma.comment.update({
    where: { id },
    data: { content, updatedAt: new Date() },
  });
}
