'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { togglePostLike } from '@/lib/post.action';

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
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onToggle = async () => {
    if (!currentUserId) return alert('로그인이 필요합니다.');
    if (loading) return;
    setLoading(true);

    // optimistic
    setLiked((s) => !s);
    setCount((c) => (liked ? Math.max(0, c - 1) : c + 1));

    try {
      const form = new FormData();
      form.set('postId', String(postId));
      const res = await togglePostLike(form);
      // sync authoritative state
      setLiked(res.liked);
      setCount(res.count);
      // refresh surrounding server components if necessary
      router.refresh();
    } catch (err) {
      console.error(err);
      // revert optimistic
      setLiked((s) => !s);
      setCount((c) => (liked ? c + 1 : Math.max(0, c - 1)));
      alert('좋아요 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={[
        'rounded',
        'bg-white',
        'px-3',
        'py-1',
        'border',
        'inline-flex',
        'items-center',
        'gap-2',
      ].join(' ')}
    >
      <span className="text-red-500">{liked ? '♥' : '♡'}</span>
      <span className="text-sm">좋아요 {count}</span>
    </button>
  );
}
