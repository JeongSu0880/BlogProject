'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useRef, useState } from 'react';

import { Label } from '@/components/ui/label';
import type { Post } from '@/lib/generated/prisma/client';
import { updatePost } from '@/lib/post.action';

export default function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      const MAX = 600; // px
      textareaRef.current.style.height = `${Math.min(newHeight, MAX)}px`;
    }
  }, []);

  const router = useRouter();

  const onSave = () => {
    startTransition(async () => {
      setIsSaving(true);
      try {
        await updatePost({ id: post.id, title, content });
        router.push('/admin');
      } catch (err) {
        console.error('save failed', err);
      } finally {
        setIsSaving(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1 block text-sm">제목</Label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <Label className="mb-1 block text-sm">내용</Label>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              const newHeight = textareaRef.current.scrollHeight;
              const MAX = 600;
              textareaRef.current.style.height = `${Math.min(newHeight, MAX)}px`;
            }
          }}
          rows={10}
          className="max-h-150 min-h-50 w-full resize overflow-auto rounded border px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="rounded bg-gray-200 px-4 py-2"
          onClick={() => router.back()}
        >
          취소
        </button>

        <button
          className="rounded bg-black px-4 py-2 text-white"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
