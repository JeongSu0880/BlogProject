'use server';
import { prisma } from './prisma';

export type ContributionSquareType = {
  dateString: string;
  date: Date;
  count: number;
};

export async function getContributionDate(): Promise<ContributionSquareType[]> {
  const rows = await prisma.contribution.findMany();

  // Server Component
  const contributions = rows.map((c) => ({
    ...c,
    dateString: c.date.toISOString().slice(0, 10),
  }));

  return contributions;
}
