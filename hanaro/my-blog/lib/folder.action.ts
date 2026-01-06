'use server';

import { prisma } from './prisma';

const deleteFolder = async (id: number) => {
  await prisma.folder.delete({});
};
const updateFolder = () => {};
const createFolder = () => {};
