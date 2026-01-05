import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import type { Folder } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type Props = { params: Promise<{ folderId: string }> };

export const generateStaticParams = async () => {
  const folders: Awaited<Folder[]> = await prisma.folder.findMany();
  return folders.map(({ id }) => ({
    folderId: id.toString(),
  }));
};

export default async function FolderPage({ params }: Props) {
  const { folderId } = await params;

  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
  });
  if (!folder) notFound();
  const posts = await prisma.post.findMany({
    where: {
      folder: Number(folderId),
    },
  });

  return (
    <div className="px-20">
      <div className="flex justify-between">
        <h2 className="pb-3 pl-3 text-xl">{folder?.title}</h2>
        {/* TODO 여기에 정렬 순서 설정하는 것도 있으면 좋겠다.. */}
      </div>
      {posts?.map((post) => {
        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <PostCard {...post} />
          </Link>
        );
      })}
    </div>
  );
}

//TODO 뒤로가기 누르면 어디로 가야할지
