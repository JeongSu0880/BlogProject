import { MoveRight } from 'lucide-react';
import type { Folder } from '@/lib/generated/prisma/client';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function FolderCard({
  title,
  description,
  createdAt,
  updatedAt,
}: Folder) {
  return (
    <div className="p-1">
      <Card className="transition-transform hover:translate-x-1">
        <CardHeader>
          <CardTitle className="font-medium">{title}</CardTitle>
          <CardDescription className="flex justify-between">
            <div className="flex gap-5">
              <div className="text-xs">
                생성일 {new Date(createdAt).toLocaleDateString('ko-KR')}
              </div>
              <div className="text-xs">
                수정일 {new Date(updatedAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <MoveRight className="" />
          </CardDescription>
          <CardAction>{/* 여기에 클릭하면 페이지 이동하도록 */}</CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-sm">{description}</div>
        </CardContent>
      </Card>
    </div>
  );
}
