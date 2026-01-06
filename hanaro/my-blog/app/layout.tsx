import type { Metadata } from 'next';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { use } from 'react';
import { ProfileToggle } from '@/components/ProfileToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: '수리공작소',
  description: '개발과 기록을 위한 블로그',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = use(auth());
  console.log('🚀 ~ session:', session?.user.isAdmin);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <div className="flex items-center justify-end gap-2 pt-3 pr-5">
                {session?.user ? (
                  <div>
                    {session.user.isAdmin === true ? (
                      <Link href="/admin">
                        <Button>관리자</Button>
                      </Link>
                    ) : (
                      ''
                    )}
                    {/* 여기 hydration 에러 어떻게 해결 */}
                    <ProfileToggle />
                  </div>
                ) : (
                  // <Link href="/api/auth/signin">로그인</Link>
                  <Link href="/sign">로그인</Link>
                )}
                <ThemeToggle />
              </div>
            </header>
            <div className="flex h-50 w-full items-center justify-center">
              <Link href="/">
                <h1 className="text-3xl">수리공작소</h1>
              </Link>
            </div>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
// TODO 로그인, 로그아웃 커스텀 페이지 만들기
// TODO 로그인 후 뒤로가기 했을 때의 처리 (redirect 이런거 꼬이지 않게)
// TODO UserToggle에 진짜 user 넣어주기
// TODO 커스텀 로그인 로그아웃 구현 (그 훅 구현)
