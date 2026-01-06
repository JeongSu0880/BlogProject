import { prisma } from '@/lib/prisma';

export default async function BlogStat() {
  const { _sum } = await prisma.post.aggregate({
    _sum: {
      readCnt: true,
      likes: true,
    },
  });

  const totalVisitor = _sum.readCnt ?? 0;
  const totalLikes = _sum.likes ?? 0;

  return (
    <div className="whitespace-nowrap rounded-md border">
      <h3 className="p-4 pb-1">오늘의 STAT💎</h3>
      <div className="p-4 pb-1">
        <div className="pb-1">
          <h1>총 방문자 수</h1>
          {totalVisitor}
        </div>
        <div>
          <h1>총 좋아요 수</h1>
          {totalLikes}
        </div>
      </div>
    </div>
  );
}
