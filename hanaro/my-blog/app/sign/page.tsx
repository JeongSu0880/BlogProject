import Link from 'next/link';
import { loginGithub } from '@/lib/sign.action';
import { GithubLoginButton } from './GithubLoginButton';
import SignForm from './SignForm';

export default function SignInPage() {
  return (
    <div>
      <div>
        <SignForm />
        {/* 이메일
        <Input type="email" />
        비밀번호
        <Input type="password" /> */}
      </div>
      <GithubLoginButton formAction={loginGithub} />
      <Link href="/sign/register">회원가입</Link>
    </div>
  );
}
