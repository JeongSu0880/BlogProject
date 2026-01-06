import { MoveRight } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

type BaseCardFields = {
  id: number | string;
  createdAt?: Date;
  updatedAt?: Date;
  expiredAt?: Date;
};

type AdminCardProps<T extends BaseCardFields> = {
  data: T;
  title?: (data: T) => React.ReactNode;
  content?: (data: T) => React.ReactNode;
  onClick?: (data: T) => void;
};

export default function AdminCard<T extends BaseCardFields>({
  data,
  title,
  content,
  onClick,
}: AdminCardProps<T>) {
  return (
    <div className="p-1">
      <Card
        className="cursor-pointer transition-transform hover:translate-x-1"
        onClick={() => onClick?.(data)}
      >
        <CardHeader>
          <CardTitle className="font-medium">{title?.(data)}</CardTitle>

          <CardDescription className="flex justify-between">
            <div className="flex gap-5 text-xs">{content?.(data)}</div>
            <MoveRight />
          </CardDescription>

          <CardAction />
        </CardHeader>
        {/* {content && (
          <CardContent>
            <div className="line-clamp-1 text-gray-400 text-sm">
              {content(data)}
            </div>
          </CardContent>
        )} */}
      </Card>
    </div>
  );
}
