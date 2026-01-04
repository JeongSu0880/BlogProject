import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <div>
      <div className="flex h-50 w-full items-center justify-center">
        <Link href="/">
          <h1 className="text-3xl">수리공작소</h1>
        </Link>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="all">전체 글 조회</TabsContent>
        <TabsContent value="stack">기술 스택 관련 글 조회</TabsContent>
        <TabsContent value="activity">
          개발 관련 활동에 관한 글 조회
        </TabsContent>
      </Tabs>
    </div>
  );
}

//TODO 글 목록을 어떻게 ... 조회할것인지?
