'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import FolderCard from '@/components/FolderCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Folder } from '@/lib/generated/prisma/client';

export default function HomeClient({
  folders,
  stopWords,
}: {
  folders: Folder[];
  stopWords: Set<string>;
}) {
  const [filterStr, setFilterStr] = useState('');

  const filtered = folders.filter((f) =>
    f.title.toLowerCase().includes(filterStr.toLowerCase()),
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Input
            onChange={(e) => {
              if (!stopWords.has(e.target.value)) setFilterStr(e.target.value);
            }}
            placeholder="Search folder..."
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="all">
        {filtered.map((folder) => (
          <Link key={folder.id} href={`/folders/${folder.id}`}>
            <FolderCard {...folder} />
          </Link>
        ))}
      </TabsContent>

      <TabsContent value="stack">
        {filtered
          .filter((i) => i.type === 'stack')
          .map((folder) => (
            <Link key={folder.id} href={`/folders/${folder.id}`}>
              <FolderCard {...folder} />
            </Link>
          ))}
      </TabsContent>

      <TabsContent value="activity">
        {filtered
          .filter((i) => i.type === 'activity')
          .map((folder) => (
            <Link key={folder.id} href={`/folders/${folder.id}`}>
              <FolderCard {...folder} />
            </Link>
          ))}
      </TabsContent>
    </Tabs>
  );
}
