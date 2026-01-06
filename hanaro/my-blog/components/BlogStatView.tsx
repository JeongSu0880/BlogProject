type BlogStatViewProps = {
  totalVisitor: number;
  totalLikes: number;
};

export default function BlogStatView({
  totalVisitor,
  totalLikes,
}: BlogStatViewProps) {
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
