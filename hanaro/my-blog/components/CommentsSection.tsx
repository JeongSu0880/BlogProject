'use client';

import {
  createCommentAction,
  deleteCommentAction,
  editCommentAction,
} from '@/lib/comment.action';
/* eslint-disable */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type CommentDTO = {
  id: number;
  content: string;
  writer: number;
  parentComment?: number | null;
  writerNickname: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [comments, setComments] = useState(initialComments);
  const [newContent, setNewContent] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Helper: we optimistically update UI after action is submitted by relying on parent refresh
  // But to make UX snappy, update local state immediately

  const router = useRouter();

  const [replyTo, setReplyTo] = useState<number | null>(null);

  const onCreate = async (e: React.FormEvent, parentId?: number | null) => {
    e.preventDefault();
    if (!currentUserId) return alert('로그인이 필요합니다.');
    if (!newContent.trim()) return alert('댓글을 입력하세요.');

    const form = new FormData();
    form.set('postId', String(postId));
    form.set('content', newContent);
    if (parentId) form.set('parentId', String(parentId));

    try {
      await createCommentAction(form);
      // optimistic update
      setComments([
        ...comments,
        {
          id: Date.now(),
          content: newContent,
          writer: currentUserId as number,
          parentComment: parentId ?? null,
          writerNickname: '나',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setNewContent('');
      setReplyTo(null);
      // refresh the server data
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('댓글 작성 실패');
    }
  };

  const onStartEdit = (c: CommentDTO) => {
    setEditing(c.id);
    setEditContent(c.content);
  };

  const onCancelEdit = () => {
    setEditing(null);
    setEditContent('');
  };

  const onSubmitEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!editContent.trim()) return alert('내용을 입력하세요.');
    const form = new FormData();
    form.set('id', String(id));
    form.set('content', editContent);
    try {
      await editCommentAction(form);
      setEditing(null);
      setEditContent('');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('댓글 수정 실패');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const form = new FormData();
    form.set('id', String(id));
    try {
      await deleteCommentAction(form);
      // reflect soft delete locally
      setComments((s) =>
        s.map((c) =>
          c.id === id
            ? { ...c, isDeleted: true, content: '삭제된 댓글입니다' }
            : c,
        ),
      );
      // refresh authoritative data
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('댓글 삭제 실패');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="mb-2 font-bold">댓글</h3>
      {currentUserId ? (
        <form onSubmit={(e) => onCreate(e, null)} className="space-y-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className={['w-full', 'border', 'px-3', 'py-2', 'rounded'].join(
              ' ',
            )}
            rows={4}
          />
          <div className="flex justify-end">
            <button
              className="rounded bg-black px-4 py-2 text-white"
              type="submit"
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

      <ul className="mt-4 space-y-4">
        {(() => {
          const renderTree = (
            parentId: number | null,
            depth = 0,
          ): React.ReactNode => {
            return comments
              .filter((c) =>
                parentId === null
                  ? c.parentComment == null
                  : c.parentComment === parentId,
              )
              .map((c) => (
                <li
                  key={c.id}
                  className={[
                    'p-3',
                    'border',
                    'rounded',
                    depth ? 'ml-6' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-gray-600 text-sm">
                        {c.writerNickname}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">
                        {c.content}
                      </div>
                      <div className="mt-2 text-gray-400 text-xs">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      {!c.isDeleted &&
                        (c.writer === currentUserId || isAdmin) && (
                          <div className="flex flex-col items-end gap-2">
                            {c.writer === currentUserId && (
                              <button
                                className="text-gray-500 text-sm"
                                onClick={() => onStartEdit(c)}
                              >
                                수정
                              </button>
                            )}
                            <button
                              className="text-red-500 text-sm"
                              onClick={() => onDelete(c.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      {!c.isDeleted && currentUserId && (
                        <div className="mt-1">
                          <button
                            className="text-gray-500 text-sm"
                            onClick={() => setReplyTo(c.id)}
                          >
                            답글
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editing === c.id && (
                    <form
                      className="mt-2"
                      onSubmit={(e) => onSubmitEdit(e, c.id)}
                    >
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={[
                          'w-full',
                          'border',
                          'px-3',
                          'py-2',
                          'rounded',
                        ].join(' ')}
                        rows={3}
                      />
                      <div
                        className={[
                          'mt-2',
                          'flex',
                          'gap-2',
                          'justify-end',
                        ].join(' ')}
                      >
                        <button
                          type="button"
                          className="rounded bg-gray-200 px-3 py-1"
                          onClick={onCancelEdit}
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="rounded bg-black px-3 py-1 text-white"
                        >
                          저장
                        </button>
                      </div>
                    </form>
                  )}

                  {replyTo === c.id && (
                    <form
                      className="mt-2"
                      onSubmit={(e) => {
                        // submit reply
                        onCreate(e, c.id);
                      }}
                    >
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className={[
                          'w-full',
                          'border',
                          'px-3',
                          'py-2',
                          'rounded',
                        ].join(' ')}
                        rows={3}
                      />
                      <div
                        className={[
                          'mt-2',
                          'flex',
                          'gap-2',
                          'justify-end',
                        ].join(' ')}
                      >
                        <button
                          type="button"
                          className="rounded bg-gray-200 px-3 py-1"
                          onClick={() => {
                            setReplyTo(null);
                            setNewContent('');
                          }}
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="rounded bg-black px-3 py-1 text-white"
                        >
                          등록
                        </button>
                      </div>
                    </form>
                  )}

                  <ul className="mt-4">{renderTree(c.id, depth + 1)}</ul>
                </li>
              ));
          };

          return renderTree(null);
        })()}
      </ul>
    </div>
  );
}
