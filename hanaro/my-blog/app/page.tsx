import BlogStat from '@/components/BlogStat';
import ContributionGrass from '@/components/ContributionGrass';
import type { Folder } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { loadStopWords } from '@/lib/stopwords';
import HomeClient from './HomeClient';
export default async function Home() {
  const folders: Folder[] = await prisma.folder.findMany();
  const stopWords = await loadStopWords();
  return (
    <div className="px-20">
      <div>
        {/* TODO 일단 나중에 stat 추가 */}
        <div className="grid grid-cols-4 gap-6 pb-3">
          <div className="col-span-3">
            <ContributionGrass />
          </div>
          <div className="col-span-1">
            <BlogStat />
          </div>
        </div>
        {/* <div className="pb-3">
          <ContributionGrass />
        </div> */}
      </div>
      <div>
        <HomeClient folders={folders} stopWords={stopWords} />
        {/* TODO 여기에 pagination 추가하기 */}
      </div>
    </div>
  );
}

//TODO 글 목록을 어떻게 ... 조회할것인지?
// TODO 파라렐 라우트 만들기
// TODO useSTate로 input을 관리하면.. 클라이언트가 무거워지나?
