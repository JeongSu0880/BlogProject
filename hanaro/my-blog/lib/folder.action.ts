'use server';

import type { Folder } from './generated/prisma/client';
import { prisma } from './prisma';

export type IdRequired<T extends { id: number }> = Pick<T, 'id'> &
  Partial<Omit<T, 'id'>>;

export const deleteFolder = async (id: number) => {
  await prisma.folder.delete({
    where: {
      id: id,
    },
  });
};

export const updateFolder = async ({ id, ...folder }: IdRequired<Folder>) => {
  const { title, description, type } = folder;
  const oldFolder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
  });

  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      title: title ?? oldFolder?.title,
      description: description ?? oldFolder?.description,
      type: type ?? oldFolder?.type,
    },
  });
};

// export const createFolder = async ({}) => {
//     await prisma.
// };
