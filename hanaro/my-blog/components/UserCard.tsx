import type { User } from '@/lib/generated/prisma/client';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

type UserCardProps = Pick<User, 'email' | 'nickname' | 'expiredAt'>;

export default function UserCard({
  email,
  nickname,
  expiredAt,
}: UserCardProps) {
  return (
    <div className="p-1">
      <Card className="transition-transform hover:translate-x-1">
        <CardHeader>
          <CardTitle className="font-medium">{email}</CardTitle>
          <CardDescription className="flex justify-between">
            <div className="flex gap-5">
              <div className="text-xs">닉네임 {nickname}</div>
              {expiredAt && (
                <div className="text-red-500 text-xs">
                  만료일 {new Date(expiredAt).toLocaleDateString('ko-KR')}
                </div>
              )}
            </div>
            {/* 여기에 삭제 어쩌구 */}
          </CardDescription>
          {/* <CardAction /> */}
        </CardHeader>
      </Card>
    </div>
  );
}
