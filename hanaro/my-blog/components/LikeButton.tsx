'use client';

import { useActionState } from 'react';
import { likePost } from '@/lib/post.action';
import { Button } from './ui/button';

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
  currentUserId,
}: {
  postId: number;
  initialCount: number;
  initialLiked: boolean;
  currentUserId?: number;
}) {
  const [state, formAction, isPending] = useActionState(
    likePost,
    { like: initialLiked, message: `좋아요${initialCount}` }, // 초기 상태
  );
  return (
    <form>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="userId" value={currentUserId} />
      <Button
        formAction={formAction}
        disabled={isPending}
        className={[
          'rounded',
          'px-3',
          'py-1',
          'border',
          'inline-flex',
          'items-center',
          'gap-2',
        ].join(' ')}
      >
        <span className="text-red-500">{state.like ? '♥' : '♡'}</span>
        <span className="text-sm">{state.message}</span>
      </Button>
    </form>
  );
}
