import { prisma } from '@/lib/prisma';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

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
  const contributions = await prisma.contribution.findMany();

  const getContributionLevel = (count: number) => {
    if (count === 0) return 0;
    return Math.min(6, Math.floor((count - 1) / 3) + 1);
  };
  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <h3 className="p-4 pb-1">나의 잔디🌱</h3>
      <TooltipProvider>
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1 p-4 pt-0">
          {contributions.map((con) => {
            const level = getContributionLevel(con.count);

            return (
              <Tooltip key={con.date.getTime()}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-4 w-4 rounded border border-gray-100 ${contributionColorMap[level]}`}
                  />
                </TooltipTrigger>

                <TooltipContent side="top">
                  <div className="text-xs">
                    <div className="font-medium">
                      {con.date.toLocaleDateString('ko-KR')}
                    </div>
                    <div className="text-muted-foreground">
                      {con.count} contributions
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
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
