import { Button } from '@/components/ui/button';

export function RegisterButton() {
  return (
    <Button className="h-12 w-full gap-2 rounded-md bg-green-500 text-white hover:bg-green-800 dark:border dark:hover:bg-green-500/80">
      <span className="font-medium text-sm">회원가입 하러가기</span>
    </Button>
  );
}
