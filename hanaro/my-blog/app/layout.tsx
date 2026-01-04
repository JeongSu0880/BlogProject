import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { ModeToggle } from '@/components/ModeToggle';
import { UserToggle } from '@/components/UserToggle';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = use(auth());
  // console.log('🚀 ~ session:', session?.user);
  const user = {
    isadmin: true,
    passwd: '12343',
    id: '1',
    name: '정수',
    email: 'sara2501',
  };
  const session = { user };

  return (
    <html lang="ko">
      <SessionProvider>
        <body>
          <header>
            {/* 이쪽에 Theme (darkmode lightmode 넣기) */}
            <div className="flex items-center justify-end gap-2 pt-3 pr-5">
              {session?.user ? (
                <div>
                  {/* <Link href="/mypage">마이페이지</Link> */}
                  {/* <Separator orientation="vertical" /> */}
                  <UserToggle user={user} />
                  {/* <Link href="/api/auth/signout">{session.user.name}</Link> */}
                </div>
              ) : (
                <Link href="/api/auth/signin">로그인</Link>
              )}
              <ModeToggle />
            </div>
          </header>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
// TODO text white 다 빼기
// TODO 로그인, 로그아웃 커스텀 페이지 만들기
// TODO 로그인 후 뒤로가기 했을 때의 처리 (redirect 이런거 꼬이지 않게)
