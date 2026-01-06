import { Suspense } from 'react';
import { getContributionDate } from '@/lib/date';
import ContributionSquare from './ContributionSquare';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { TooltipProvider } from './ui/tooltip';

export const contributionColorMap: Record<number, string> = {
  0: 'bg-transparent',
  1: 'bg-green-100',
  2: 'bg-green-200',
  3: 'bg-green-300',
  4: 'bg-green-400',
  5: 'bg-green-500',
  6: 'bg-green-600',
};

export default async function ContributionGrass() {
  const contributions = await getContributionDate();
  const getContributionLevel = (count: number) => {
    if (count === 0) return 0;
    return Math.min(6, Math.floor((count - 1) / 3) + 1);
  };
  return (
    <Suspense fallback={null}>
      <ScrollArea className="whitespace-nowrap rounded-md border">
        <h3 className="p-4 pb-1">나의 잔디🌱</h3>
        <TooltipProvider>
          <div className="grid w-max grid-flow-col grid-rows-7 gap-1 p-4 pt-0">
            {contributions.map((con) => {
              const level = getContributionLevel(con.count);

              return (
                <ContributionSquare
                  key={con.dateString}
                  con={con}
                  className={`h-4 w-4 rounded border border-gray-100 ${contributionColorMap[level]}`}
                />
              );
            })}
          </div>
        </TooltipProvider>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Suspense>
  );
  //   return (
  //     <ScrollArea className="whitespace-nowrap rounded-md border">
  //       <h3 className="p-4 pb-1">Contribution</h3>
  //       <div className="grid w-max grid-flow-col grid-rows-7 gap-1 p-4 pt-0">
  //         {contributions.map((con) => {
  //           const level = getContributionLevel(con.count);
  //           return (
  //             <div
  //               key={con.date.getTime()}
  //               className={`h-4 w-4 rounded border-1 ${contributionColorMap[level]}`}
  //             />
  //           );
  //         })}
  //       </div>

  //       <ScrollBar orientation="horizontal" />
  //     </ScrollArea>
  //   );
}
