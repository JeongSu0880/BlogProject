import { FolderType } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

async function main() {
  console.log('🌱 Start seeding...');

  /**
   * 1️⃣ User
   */
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@test.com',
        nickname: 'admin',
        passwd: 'hashed-password',
        isAdmin: true,
      },
      {
        email: 'user1@test.com',
        nickname: 'user1',
        passwd: 'hashed-password',
      },
      {
        email: 'user2@test.com',
        nickname: 'user2',
        passwd: 'hashed-password',
      },
    ],
  });

  console.log('✅ Users seeded');
  /**
   * 2️⃣ Folder
   */
  /**
   * 2️⃣ Folder (실제 카테고리들)
   */
  await prisma.folder.createMany({
    data: [
      // 🔧 기술 스택
      {
        title: 'React',
        description: 'React 관련 글',
        type: FolderType.stack,
      },
      {
        title: 'JavaScript',
        description: 'JavaScript 문법 및 개념',
        type: FolderType.stack,
      },
      {
        title: 'TypeScript',
        description: 'TypeScript 타입 시스템',
        type: FolderType.stack,
      },
      {
        title: 'C',
        description: 'C 언어 기초',
        type: FolderType.stack,
      },
      {
        title: 'C++',
        description: 'C++ 문법 및 STL',
        type: FolderType.stack,
      },
      {
        title: 'Java',
        description: 'Java 및 JVM',
        type: FolderType.stack,
      },
      {
        title: 'Next.js',
        description: 'Next.js App Router',
        type: FolderType.stack,
      },
      {
        title: 'Node.js',
        description: 'Node.js 서버 개발',
        type: FolderType.stack,
      },

      // 🚀 활동
      {
        title: '42서울',
        description: '42Seoul 학습 기록',
        type: FolderType.activity,
      },
      {
        title: '디지털 하나로',
        description: '디지털 하나로 프로젝트',
        type: FolderType.activity,
      },
    ],
  });
  console.log('✅ Folders seeded');

  /**
   * 3️⃣ Post
   */
  const reactFolder = await prisma.folder.findUnique({
    where: { title: 'React' },
  });

  const fortyTwoFolder = await prisma.folder.findUnique({
    where: { title: '42서울' },
  });

  if (!reactFolder || !fortyTwoFolder) {
    throw new Error('Folder not found');
  }

  await prisma.post.createMany({
    data: [
      {
        title: 'useEffect 정리',
        content: 'useEffect 동작 원리',
        folder: reactFolder.id,
      },
      {
        title: 'Piscine 후기',
        content: '42서울 Piscine 회고',
        folder: fortyTwoFolder.id,
      },
    ],
  });

  console.log('✅ Posts seeded');

  /**
   * 4️⃣ Comment
   */
  const postList = await prisma.post.findMany();

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@test.com' },
  });

  const user1 = await prisma.user.findUnique({
    where: { email: 'user1@test.com' },
  });

  if (!admin || !user1) throw new Error('User not found');

  const comment1 = await prisma.comment.create({
    data: {
      post: postList[0].id,
      writer: admin.id,
      content: '좋은 글이네요 👍',
    },
  });

  await prisma.comment.create({
    data: {
      post: postList[0].id,
      writer: user1.id,
      parentComment: comment1.id,
      content: '동의합니다!',
    },
  });

  console.log('✅ Comments seeded');

  /**
   * 5️⃣ PostLike
   */
  await prisma.postLike.createMany({
    data: [
      {
        user: admin.id,
        post: postList[0].id,
      },
      {
        user: user1.id,
        post: postList[0].id,
      },
    ],
  });

  console.log('✅ PostLikes seeded');

  /**
   * 6️⃣ Contribution (잔디)
   */
  await prisma.contribution.createMany({
    data: [
      { date: new Date('2025-01-01'), count: 3 },
      { date: new Date('2025-01-02'), count: 5 },
      { date: new Date('2025-01-03'), count: 2 },
    ],
  });

  console.log('✅ Contributions seeded');

  console.log('🌱 Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
