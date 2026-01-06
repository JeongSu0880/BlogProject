'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { regist } from '@/lib/sign.action';

export default function RegisterForm() {
  const [validError, makeRegist, isPending] = useActionState(regist, undefined);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [passwd, setPasswd] = useState('');
  const [passwd2, setPasswd2] = useState('');

  const submittedRef = useRef(false);

  useEffect(() => {
    if (validError?.data) {
      setEmail(validError.data.email || '');
      setNickname(validError.data.nickname || '');
      setPasswd(validError.data.passwd || '');
      setPasswd2(validError.data.passwd2 || '');
    }
  }, [validError]);

  useEffect(() => {
    if (isPending) {
      submittedRef.current = true;
      return;
    }

    if (!isPending && submittedRef.current) {
      if (!validError) {
        router.back();
      }
      submittedRef.current = false;
    }
  }, [isPending, validError, router]);

  return (
    <div className="grid place-items-center">
      <form action={makeRegist} className="w-full space-y-3">
        {validError?.error?.email && (
          <div className="text-center text-red-600">
            {validError.error.email}
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@email.com"
            className="w-full"
            aria-invalid={!!validError?.error.email}
          />
          {validError?.error.email && (
            <p className="text-red-500">{validError.error.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="nickname..."
            className="w-full"
            aria-invalid={!!validError?.error.nickname}
          />
          {validError?.error.nickname && (
            <p className="text-red-500">{validError.error.nickname}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="passwd">비밀번호</Label>
          <Input
            id="passwd"
            name="passwd"
            type="password"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            placeholder="password..."
            aria-invalid={!!validError?.error.passwd}
          />
          {validError?.error.passwd && (
            <p className="text-red-500">{validError.error.passwd}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="passwd2">비밀번호 확인</Label>
          <Input
            id="passwd2"
            name="passwd2"
            type="password"
            value={passwd2}
            onChange={(e) => setPasswd2(e.target.value)}
            placeholder="password2..."
            aria-invalid={!!validError?.error.passwd2}
          />
          {validError?.error.passwd2 && (
            <p className="text-red-500">{validError.error.passwd2}</p>
          )}
        </div>

        <div className="flex justify-center gap-5">
          <Button
            variant={'outline'}
            type="reset"
            onClick={() => {
              setEmail('');
              setNickname('');
              setPasswd('');
              setPasswd2('');
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Regist {isPending && '...'}
          </Button>
        </div>
      </form>
    </div>
  );
}
