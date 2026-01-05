import { MoveRight } from 'lucide-react';
import type { Post } from '@/lib/generated/prisma/client';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function PostCard({
  title,
  content,
  likes,
  createdAt,
  updatedAt,
  readCnt,
}: Post) {
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
              <div className="text-xs">좋아요 {likes}</div>
              <div className="text-xs">조회수 {readCnt}</div>
            </div>
            <MoveRight />
          </CardDescription>
          <CardAction>{/* 여기에 클릭하면 페이지 이동하도록 */}</CardAction>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-1 text-gray-400 text-sm">{content}</div>
        </CardContent>
      </Card>
    </div>
  );
}
