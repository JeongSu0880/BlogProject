import { notFound } from 'next/navigation';
import type { Folder } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { loadStopWords } from '@/lib/stopwords';
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
  const stopWordSet = await loadStopWords();
  return (
    <FolderClient posts={posts} title={folder.title} stopWords={stopWordSet} />
  );
}

//TODO 뒤로가기 누르면 어디로 가야할지
// TODO 불용어도 여기저기 쓰이는데.. 이거 전역적으로 관리해야하는지
