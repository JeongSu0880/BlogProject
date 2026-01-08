'use client';

import { useActionState } from 'react';
import { commentAction } from '@/lib/comment.action';

export type CommentDTO = {
  id: number;
  content: string;
  writer: number;
  parentComment?: number | null;
  writerNickname: string;
  isDeleted: boolean;
  createdAt: string; // 🔥 서버에서 이미 포맷된 문자열
};

export default function CommentsSection({
  initialComments,
  postId,
  currentUserId,
  isAdmin,
}: {
  initialComments: CommentDTO[];
  postId: number;
  currentUserId?: number;
  isAdmin?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(commentAction, {
    editingId: null,
    content: '',
    comments: initialComments,
  });

  const { comments, editingId, content } = state;

  /* ======================
     Tree renderer
  ====================== */

  const renderTree = (parentId: number | null, depth = 0) => {
    return comments
      .filter((c) =>
        parentId === null
          ? c.parentComment == null
          : c.parentComment === parentId,
      )
      .map((c) => {
        const canEdit = c.writer === currentUserId;
        const canDelete = canEdit || isAdmin;

        return (
          <li
            key={c.id}
            className={['p-3', 'border', 'rounded', depth ? 'ml-6' : ''].join(
              ' ',
            )}
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-gray-600 text-sm">{c.writerNickname}</div>

                <div className="mt-1 whitespace-pre-wrap">
                  {c.isDeleted ? '삭제된 댓글입니다.' : c.content}
                </div>

                <div className="mt-2 text-gray-400 text-xs">{c.createdAt}</div>
              </div>

              {!c.isDeleted && canDelete && (
                <div className="flex flex-col items-end gap-2 text-sm">
                  {canEdit && (
                    <form>
                      <input type="hidden" name="intent" value="startEdit" />
                      <input type="hidden" name="commentId" value={c.id} />

                      <button formAction={formAction} disabled={isPending}>
                        수정
                      </button>
                    </form>
                  )}
                  <form>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="commentId" value={c.id} />
                    <button
                      value="delete"
                      formAction={formAction}
                      disabled={isPending}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              )}
            </div>

            {editingId === c.id && (
              <form className="mt-2">
                <textarea
                  name="content"
                  defaultValue={c.content}
                  className="w-full rounded border px-3 py-2"
                  rows={3}
                />
                <input type="hidden" name="commentId" value={c.id} />
                <input type="hidden" name="intent" value="edit" />

                <div className="mt-2 flex justify-end gap-2">
                  {/* <input type="hidden" name="intent" value="cancel" /> */}
                  <button
                    value="cancelEdit"
                    formAction={formAction}
                    type="submit"
                  >
                    취소
                  </button>

                  <button
                    type="submit"
                    formAction={formAction}
                    className="rounded bg-black px-3 py-1 text-white"
                  >
                    저장
                  </button>
                </div>
              </form>
            )}

            <ul className="mt-4">{renderTree(c.id, depth + 1)}</ul>
          </li>
        );
      });
  };

  return (
    <div className="mt-8">
      <h3 className="mb-2 font-bold">댓글</h3>

      {currentUserId ? (
        <form className="space-y-2">
          <textarea
            name="content"
            placeholder="댓글을 입력하세요"
            className="w-full rounded border px-3 py-2"
            rows={4}
          />
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="intent" value="create" />

          <div className="flex justify-end">
            <button
              type="submit"
              formAction={formAction}
              disabled={isPending}
              className="rounded bg-black px-4 py-2 text-white"
            >
              등록
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 text-sm">
          댓글은 로그인 후 작성할 수 있습니다.
        </p>
      )}

      <ul className="mt-4 space-y-4">{renderTree(null)}</ul>

      {state.error && (
        <p className="mt-2 text-red-500 text-sm">{state.error}</p>
      )}
    </div>
  );
}
