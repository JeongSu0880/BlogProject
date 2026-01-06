'use client';
import type { ContributionSquareType } from '@/lib/date';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type ContributionSquareProps = {
  con: ContributionSquareType;
  className?: string;
};

export default function ContributionSquare({
  con,
  className,
}: ContributionSquareProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={className} />
      </TooltipTrigger>

      <TooltipContent side="top">
        <div className="text-xs">
          <div className="font-medium">{con.dateString}</div>
          <div className="text-muted-foreground">{con.count} contributions</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
