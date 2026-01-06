import { FolderType } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/* =========================
 * util functions
 * ========================= */

function generateContributions(start: string, end: string) {
  const result: { date: Date; count: number }[] = [];
  const cur = new Date(start);
  const endDate = new Date(end);

  while (cur <= endDate) {
    result.push({
      date: new Date(cur),
      count: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 8) + 1,
    });
    cur.setDate(cur.getDate() + 1);
  }

  return result;
}

function randomReadCnt() {
  return Math.floor(Math.random() * 500) + 10;
}

function randomLikes(max: number) {
  return Math.floor(Math.random() * Math.min(50, max));
}

/* =========================
 * main seed (⭐ 여기 안에만 await!)
 * ========================= */

async function main() {
  console.log('🌱 Start seeding...');

  // 1️⃣ User
  await prisma.user.createMany({
    data: [
      {
        email: 'latsyrc900@gmail.com',
        nickname: '정수',
        passwd: 'hashed-password',
        isAdmin: true,
      },
      { email: 'user1@test.com', nickname: 'user1', passwd: 'hashed-password' },
      { email: 'user2@test.com', nickname: 'user2', passwd: 'hashed-password' },
    ],
    skipDuplicates: true,
  });

  // 2️⃣ Folder
  await prisma.folder.createMany({
    data: [
      { title: 'React', description: 'React 관련 글', type: FolderType.stack },
      {
        title: '디지털 하나로',
        description: '디지털 하나로 프로젝트',
        type: FolderType.activity,
      },
      {
        title: 'JavaScript',
        description: 'JavaScript 개념 정리',
        type: FolderType.stack,
      },
      {
        title: '42서울',
        description: '42Seoul 학습 기록',
        type: FolderType.activity,
      },
      {
        title: 'TypeScript',
        description: 'TypeScript 심화',
        type: FolderType.stack,
      },
      {
        title: 'Next.js',
        description: 'Next.js App Router',
        type: FolderType.stack,
      },
    ],
    skipDuplicates: true,
  });

  const folders = await prisma.folder.findMany();
  const folderMap = Object.fromEntries(folders.map((f) => [f.title, f.id]));

  // 3️⃣ Post
  await prisma.post.createMany({
    data: [
      // =========================
      // React
      // =========================
      {
        title: 'useEffect 완전 정복',
        folder: folderMap['React'],
        content: `
React를 사용하다 보면 가장 먼저 마주치게 되는 훅 중 하나가 useEffect입니다.

useEffect는 컴포넌트의 렌더링 이후 특정 로직을 실행하기 위해 사용되며,
데이터 fetching, 구독 설정, DOM 조작과 같은 사이드 이펙트를 처리하는 데 적합합니다.

의존성 배열을 어떻게 작성하느냐에 따라
컴포넌트의 동작 방식이 완전히 달라질 수 있습니다.

이 글에서는 useEffect의 동작 원리와
실무에서 자주 발생하는 문제를 중심으로 정리해보겠습니다.
      `,
      },
      {
        title: 'useState와 useReducer 비교',
        folder: folderMap['React'],
        content: `
React에서 상태 관리는 매우 중요한 개념입니다.

간단한 상태에는 useState가 적합하지만,
상태 로직이 복잡해질수록 useReducer가 더 명확한 구조를 제공합니다.

이 글에서는 두 훅의 차이점과
어떤 상황에서 어떤 훅을 선택하는 것이 좋은지 살펴봅니다.

실제 프로젝트에서의 사용 경험을 바탕으로
선택 기준을 정리해보겠습니다.
      `,
      },

      // =========================
      // JavaScript
      // =========================
      {
        title: '자바스크립트 클로저 이해하기',
        folder: folderMap['JavaScript'],
        content: `
클로저는 자바스크립트의 핵심 개념 중 하나로,
함수가 선언될 당시의 스코프를 기억하는 특성을 말합니다.

이 개념을 이해하면
자바스크립트의 동작 방식이 훨씬 명확해집니다.

이 글에서는 클로저의 기본 개념과
실무에서 활용되는 예제를 중심으로 설명합니다.
      `,
      },
      {
        title: 'this 바인딩 정리',
        folder: folderMap['JavaScript'],
        content: `
this는 자바스크립트에서 가장 혼란스러운 개념 중 하나입니다.

this는 함수가 선언된 위치가 아니라
어떻게 호출되었는지에 따라 결정됩니다.

이 글에서는 this가 결정되는 규칙과
자주 실수하는 패턴을 정리해보겠습니다.
      `,
      },

      // =========================
      // TypeScript
      // =========================
      {
        title: 'TypeScript는 왜 필요한가',
        folder: folderMap['TypeScript'],
        content: `
TypeScript는 자바스크립트의 단점을 보완하기 위해 등장한 언어입니다.

정적 타입을 통해 코드의 안정성을 높이고,
협업 시 의사소통 비용을 줄여줍니다.

이 글에서는 TypeScript가 해결하는 문제와
실제 프로젝트에서 느낀 장점을 중심으로 정리합니다.
      `,
      },
      {
        title: 'interface vs type',
        folder: folderMap['TypeScript'],
        content: `
TypeScript를 사용하다 보면
interface와 type 중 무엇을 써야 할지 고민하게 됩니다.

두 문법은 비슷해 보이지만
용도와 확장 방식에서 차이가 있습니다.

이 글에서는 두 문법의 차이와
실무에서의 선택 기준을 정리해보겠습니다.
      `,
      },

      // =========================
      // Next.js
      // =========================
      {
        title: 'Next.js App Router 정리',
        folder: folderMap['Next.js'],
        content: `
Next.js App Router는 기존 Pages Router와는
전혀 다른 구조를 가지고 있습니다.

Server Component와 Client Component의 개념을 이해하면
App Router의 강점을 제대로 활용할 수 있습니다.

이 글에서는 App Router의 기본 구조와
자주 사용하는 패턴을 정리해보겠습니다.
      `,
      },
      {
        title: 'Server Component 제대로 이해하기',
        folder: folderMap['Next.js'],
        content: `
Server Component는 서버에서 실행되는 컴포넌트로,
데이터 패칭과 렌더링을 효율적으로 처리할 수 있게 해줍니다.

클라이언트 컴포넌트와의 차이를 이해하는 것이 중요합니다.

이 글에서는 Server Component의 개념과
실무에서의 활용 방법을 설명합니다.
      `,
      },

      // =========================
      // 42서울
      // =========================
      {
        title: '42서울 Piscine 회고',
        folder: folderMap['42서울'],
        content: `
42서울 Piscine은 단순한 코딩 과정이 아니라,
문제를 해결하는 사고방식을 완전히 바꾸는 경험이었습니다.

매일 반복되는 과제와 평가 속에서
스스로 성장하고 있음을 느낄 수 있었습니다.

이 글에서는 Piscine 기간 동안의 경험을 정리합니다.
      `,
      },
      {
        title: 'Piscine 준비 팁',
        folder: folderMap['42서울'],
        content: `
Piscine을 앞두고 있다면
기술적인 준비뿐만 아니라 마음가짐도 중요합니다.

이 글에서는 Piscine을 준비하며
도움이 되었던 팁들을 정리해보겠습니다.
      `,
      },

      // =========================
      // 디지털 하나로
      // =========================
      {
        title: '디지털 하나로 프로젝트 후기',
        folder: folderMap['디지털 하나로'],
        content: `
디지털 하나로 프로젝트는
기획부터 개발까지 전 과정을 경험할 수 있는 기회였습니다.

기술적인 성장뿐만 아니라
협업의 중요성을 깊이 느낄 수 있었습니다.

이 글에서는 프로젝트를 진행하며 느낀 점을 정리합니다.
      `,
      },
      {
        title: '팀 프로젝트에서 배운 것',
        folder: folderMap['디지털 하나로'],
        content: `
팀 프로젝트를 진행하면서
기술보다 더 중요한 것이 소통이라는 것을 깨달았습니다.

역할 분담과 일정 관리의 중요성,
그리고 협업의 어려움을 경험했습니다.

이 글에서는 그 과정에서 배운 점을 정리합니다.
      `,
      },
    ],
  });

  console.log('✅ Posts seeded');

  // 4️⃣ Contribution
  const contributions = generateContributions('2025-01-01', '2026-12-31');
  await prisma.contribution.createMany({
    data: contributions,
    skipDuplicates: true,
  });
  console.log('✅ Contributions seeded');

  // 5️⃣ likes / readCnt
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    const readCnt = randomReadCnt();
    const likes = randomLikes(readCnt);
    await prisma.post.update({
      where: { id: post.id },
      data: { readCnt, likes },
    });
  }

  console.log('✅ Post likes & readCnt updated');
}

/* =========================
 * execute
 * ========================= */

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
