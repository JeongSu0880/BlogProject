// page.tsx

import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EditPostForm from './EditPostFrom';

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  if (!session?.user.isAdmin) redirect('/');

  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  const folders = await prisma.folder.findMany({});

  if (!post) notFound();

  return (
    <div className="px-20 py-10">
      <h1 className="mb-6 font-bold text-xl">게시글 수정</h1>
      <EditPostForm post={post} folders={folders} />
    </div>
  );
}
