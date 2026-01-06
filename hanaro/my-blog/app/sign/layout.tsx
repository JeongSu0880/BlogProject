import type { PropsWithChildren, ReactNode } from 'react';

export default function SignLayout({
  children,
  viewer,
}: PropsWithChildren<{ viewer: ReactNode }>) {
  return (
    <>
      <h1 className="text-center text-xl">로그인</h1>
      <div>{children}</div>
      <div>{viewer}</div>
    </>
  );
}
