import { type PropsWithChildren, type ReactNode, use } from 'react';
import { auth } from '@/lib/auth';

export default function AdminPage({
  children,
  viewer,
}: PropsWithChildren<{ viewer: ReactNode }>) {
  const session = use(auth());
  return (
    <div>
      <h1 className="pl-4">어서오세요, {session?.user.name}님!</h1>
      {children}
      {viewer}
    </div>
  );
}
