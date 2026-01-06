import { notFound, redirect } from 'next/navigation';
import { use } from 'react';
import { auth } from '@/lib/auth';
import type { Post } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type Props = { params: Promise<{ postId: string }> };

export const generateStaticParams = async () => {
  const session = use(auth());

  if (!session || !session.user.isAdmin) {
    redirect('/');
  }
  const posts: Awaited<Post[]> = await prisma.post.findMany();
  return posts.map(({ id }) => ({
    postId: id.toString(),
  }));
};

export default async function PostPage({ params }: Props) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
    include: {
      Folder: true,
    },
  });

  if (!post) notFound(); //TODO notfound 페이지 만들기

  return (
    <div className="px-20">
      <h5 className="pb-3 text-sm">{post.Folder.title}</h5>
      <div className="flex items-center justify-between">
        <h2 className="pb-3 text-xl">{post.title}</h2>
        <h6 className="text-xs">
          작성일 {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </h6>
      </div>
      <div>{post.content}</div>
    </div>
  );
}
//TODO 관리자 권한이 아니라면 XX
