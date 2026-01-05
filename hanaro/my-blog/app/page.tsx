import { Search } from 'lucide-react';
import Link from 'next/link';
import FolderCard from '@/components/FolderCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Folder } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const folders: Folder[] = await prisma.folder.findMany();
  return (
    <div className="px-20">
      <div>
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Input />
              <Search />
            </div>
          </div>
          <TabsContent value="all">
            {folders?.map((folder) => {
              return (
                <Link key={folder.id} href={`/folders/${folder.id}`}>
                  <FolderCard {...folder} />
                </Link>
              );
            })}
          </TabsContent>
          <TabsContent value="stack">
            {folders
              ?.filter((i) => i.type === 'stack')
              .map((folder) => {
                return (
                  <Link key={folder.id} href={`/folders/${folder.id}`}>
                    <FolderCard {...folder} />
                  </Link>
                );
              })}
          </TabsContent>
          <TabsContent value="activity">
            {folders
              ?.filter((i) => i.type === 'activity')
              .map((folder) => {
                return (
                  <Link key={folder.id} href={`/folders/${folder.id}`}>
                    <FolderCard key={folder.id} {...folder} />
                  </Link>
                );
              })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

//TODO 글 목록을 어떻게 ... 조회할것인지?
