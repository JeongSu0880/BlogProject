import { notFound } from 'next/navigation';
import type { Folder } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import FolderClient from './FolderClient';

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

  return <FolderClient posts={posts} title={folder.title} />;
}

//TODO 뒤로가기 누르면 어디로 가야할지
