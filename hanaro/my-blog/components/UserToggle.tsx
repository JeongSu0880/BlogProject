'use client';
import Link from 'next/link';
import type { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth';

export function UserToggle({ user }: User) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="font-medium">
          {/*여기에 유저 이름이 쓰여야 하는데 나 nickname으로 했는디,, */}
          TestUser
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/mypage">My Page</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
