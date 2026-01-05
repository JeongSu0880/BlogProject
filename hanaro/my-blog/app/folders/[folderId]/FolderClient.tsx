'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Post } from '@/lib/generated/prisma/client';

export default function FolderClient({
  posts,
  title,
}: {
  posts: Post[];
  title: string;
}) {
  const [filterStr, setFilterStr] = useState('');

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(filterStr.toLowerCase()) ||
      p.content.toLowerCase().includes(filterStr.toLowerCase()),
  );

  return (
    <div className="px-20">
      <div className="flex justify-between">
        <h2 className="pb-3 pl-3 text-xl">{title}</h2>
        {/* TODO 여기에 정렬 순서 설정하는 것도 있으면 좋겠다.. */}
        <div className="flex gap-1">
          <Input
            value={filterStr}
            onChange={(e) => setFilterStr(e.target.value)}
            placeholder="Search posts..."
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {filtered?.map((post) => {
        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <PostCard {...post} />
          </Link>
        );
      })}
    </div>
  );
}
