'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function createCommentAction(formData: FormData) {
  const postId = Number(formData.get('postId'));
  const content = String(formData.get('content') || '').trim();
  const parentId = formData.get('parentId')
    ? Number(formData.get('parentId'))
    : undefined;

  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  if (!content) throw new Error('내용을 입력해주세요.');

  try {
    // validate post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    // if parentId provided, validate parent comment exists and belongs to same post
    if (parentId !== undefined) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parent) throw new Error('Parent comment not found');
      if (parent.post !== postId)
        throw new Error('Parent comment belongs to a different post');
    }

    await prisma.comment.create({
      data: {
        post: postId,
        content,
        writer: Number(session.user.id),
        parentComment: parentId,
      },
    });
  } catch (err) {
    console.error('createCommentAction error:', err);
    throw err;
  }
}

export async function deleteCommentAction(formData: FormData) {
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
  try {
    await prisma.comment.update({
      where: { id },
      data: {
        isDeleted: true,
        content: '삭제된 댓글입니다',
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('deleteCommentAction error:', err);
    throw err;
  }
}

export async function editCommentAction(formData: FormData) {
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

  try {
    await prisma.comment.update({
      where: { id },
      data: { content, updatedAt: new Date() },
    });
  } catch (err) {
    console.error('editCommentAction error:', err);
    throw err;
  }
}
