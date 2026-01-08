'use server';
import type { CommentDTO } from '@/components/CommentsSection';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function createComment(formData: FormData) {
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

export async function deleteComment(formData: FormData) {
  const id = Number(formData.get('id'));

  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  console.log('id :: ', id);
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error('Comment not found');

  const currentUserId = Number(session.user.id);
  if (comment.writer !== currentUserId && !session.user.isAdmin) {
    throw new Error('권한이 없습니다.');
  }

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

export async function editComment(formData: FormData) {
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

export type CommentState = {
  editingId: number | null;
  content: string;
  comments: CommentDTO[];
  error?: string;
};

/* ======================
   helper
====================== */

async function fetchComments(postId: number): Promise<CommentDTO[]> {
  const rows = await prisma.comment.findMany({
    where: { post: postId },
    include: { User: true },
    orderBy: { createdAt: 'asc' },
  });

  return rows.map((c) => ({
    id: c.id,
    content: c.isDeleted ? '삭제된 댓글입니다.' : c.content,
    writer: c.writer,
    parentComment: c.parentComment,
    writerNickname: c.User.nickname,
    isDeleted: c.isDeleted,
    createdAt: c.createdAt.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    }),
  }));
}

/* ======================
   main action
====================== */

export async function commentAction(
  prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const intent = formData.get('intent');
  const session = await auth();

  const userId = session?.user?.id ? Number(session.user.id) : null;

  const isAdmin = !!session?.user?.isAdmin;

  try {
    switch (intent) {
      /* ======================
         CREATE
      ====================== */
      case 'create': {
        if (!userId) {
          return { ...prev, error: '로그인이 필요합니다.' };
        }

        const postId = Number(formData.get('postId'));
        const content = String(formData.get('content') || '').trim();
        const parentComment = formData.get('parentComment');

        if (!content) {
          return { ...prev, error: '댓글 내용을 입력하세요.' };
        }

        await prisma.comment.create({
          data: {
            post: postId,
            writer: userId,
            content,
            parentComment: parentComment ? Number(parentComment) : null,
          },
        });

        return {
          editingId: null,
          content: '',
          comments: await fetchComments(postId),
        };
      }

      /* ======================
         START EDIT
      ====================== */
      case 'startEdit': {
        const commentId = Number(formData.get('commentId'));
        return {
          ...prev,
          editingId: commentId,
        };
      }

      /* ======================
         CANCEL EDIT
      ====================== */
      case 'cancelEdit': {
        return {
          ...prev,
          editingId: null,
        };
      }

      /* ======================
         EDIT
      ====================== */
      case 'edit': {
        if (!userId) {
          return { ...prev, error: '로그인이 필요합니다.' };
        }

        const commentId = Number(formData.get('commentId'));
        const content = String(formData.get('content') || '').trim();

        if (!content) {
          return { ...prev, error: '내용을 입력하세요.' };
        }

        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          return { ...prev, error: '댓글이 존재하지 않습니다.' };
        }

        if (comment.writer !== userId) {
          return { ...prev, error: '수정 권한이 없습니다.' };
        }

        await prisma.comment.update({
          where: { id: commentId },
          data: { content },
        });

        return {
          editingId: null,
          content: '',
          comments: await fetchComments(comment.post),
        };
      }

      /* ======================
         DELETE (soft)
      ====================== */
      case 'delete': {
        if (!userId) {
          return { ...prev, error: '로그인이 필요합니다.' };
        }

        const commentId = Number(formData.get('commentId'));

        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
        });

        if (!comment) {
          return { ...prev, error: '댓글이 존재하지 않습니다.' };
        }

        if (comment.writer !== userId && !isAdmin) {
          return { ...prev, error: '삭제 권한이 없습니다.' };
        }

        await prisma.comment.update({
          where: { id: commentId },
          data: {
            isDeleted: true,
            content: '',
          },
        });

        return {
          editingId: null,
          content: '',
          comments: await fetchComments(comment.post),
        };
      }

      default:
        return prev;
    }
  } catch (e) {
    console.error(e);
    return {
      ...prev,
      error: '처리 중 오류가 발생했습니다.',
    };
  }
}
