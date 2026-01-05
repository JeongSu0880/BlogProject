import { prisma } from '@/lib/prisma';

export async function loadStopWords() {
  const stopWords = await prisma.$queryRaw<
    { value: string }[]
  >`SELECT value FROM StopWord`;
  return new Set(stopWords.map((w) => w.value));
}
// TODO 최초 한번만 가져오기ㅠㅠ
