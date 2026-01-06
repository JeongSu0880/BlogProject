// page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EditPostForm from '../[postId]/edit/EditPostFrom';

export default async function PostNewPage() {
  const session = await auth();
  if (!session?.user.isAdmin) redirect('/');

  const folders = await prisma.folder.findMany({});

  return (
    <div className="px-20 py-10">
      <h1 className="mb-6 font-bold text-xl">게시글 수정</h1>
      <EditPostForm folders={folders} />
    </div>
  );
}
