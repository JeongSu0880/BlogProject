'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function deleteCommentAction(formData: FormData) {
  const id = Number(formData.get('id'));

  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error('Comment not found');

  const currentUserId = Number(session.user.id);
  if (comment.writer !== currentUserId && !session.user.isAdmin) {
    throw new Error('권한이 없습니다.');
  }

  // soft delete: mark isDeleted and replace content
  await prisma.comment.update({
    where: { id },
    data: {
      isDeleted: true,
      content: '삭제된 댓글입니다',
      updatedAt: new Date(),
    },
  });
}
