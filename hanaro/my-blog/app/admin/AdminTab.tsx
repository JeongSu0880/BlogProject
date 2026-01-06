'use client';
import { Pen, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import PostCard from '@/components/PostCard';
import UserCard from '@/components/UserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Folder, Post, User } from '@/lib/generated/prisma/client';
import { deletePostAction } from './actions/deletePostAction';
import FolderContent from './FolderContent';

export default function AdminTab({
  folders,
  posts,
  users,
}: {
  folders: Folder[];
  posts: Post[];
  users: User[];
}) {
  const [filterStr, setFilterStr] = useState('');

  const filteredFolders = folders.filter((f) =>
    f.title.toLowerCase().includes(filterStr.toLowerCase()),
  );
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(filterStr.toLowerCase()) ||
      p.content.toLowerCase().includes(filterStr.toLowerCase()),
  );
  const filteredUsers = users.filter(
    (u) =>
      u.nickname.toLowerCase().includes(filterStr.toLowerCase()) ||
      u.email.toLowerCase().includes(filterStr.toLowerCase()),
  );

  return (
    <div>
      <Tabs defaultValue="사용자">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 pl-4">
            <TabsList>
              <TabsTrigger value="사용자">사용자</TabsTrigger>
              <TabsTrigger value="게시판">게시판</TabsTrigger>
              <TabsTrigger value="포스팅">포스팅</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-2">
            <Input
              onChange={(e) => {
                setFilterStr(e.target.value);
              }}
              placeholder="Search folder..."
            />
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="사용자">
          {filteredUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-10 items-center">
              <div className="col-span-10">
                <UserCard
                  email={user.email}
                  nickname={user.nickname}
                  expiredAt={user.expiredAt}
                />
              </div>
              {/* <div className="col-span-9">
                <UserCard
                  email={user.email}
                  nickname={user.nickname}
                  expiredAt={user.expiredAt}
                />
              </div>
              <div className="col-span-1">{user.expiredAt && <X />}</div> */}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="게시판">
          {filteredFolders.map((folder) => (
            <FolderContent key={folder.id} {...folder} />
          ))}
        </TabsContent>

        <TabsContent value="포스팅">
          <div className="mb-4 flex items-center justify-end">
            <Link href="/admin/posts/new">
              <Button>
                <Pen className="mr-2 h-4 w-4" />
                게시글 추가
              </Button>
            </Link>
          </div>

          {filteredPosts.map((post) => (
            <div key={post.id} className="grid grid-cols-14 items-center">
              <div className="col-span-12">
                <Link href={`/posts/${post.id}`}>
                  <PostCard {...post} />
                </Link>
              </div>

              <div>
                <div className="justity-center col-span-1 flex text-gray-500">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button>
                      <Pen />
                    </Button>
                  </Link>
                </div>

                <div className="justity-center col-span-1 text-gray-500">
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <Button
                      type="submit"
                      onClick={(e) => {
                        if (!confirm('정말 삭제하시겠습니까?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <X />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
