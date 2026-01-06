import Link from 'next/link';
import { loginGithub } from '@/lib/sign.action';
import { GithubLoginButton } from './GithubLoginButton';
import SignForm from './SignForm';
import { RegisterButton } from './RegisterButton';

export default function SignInPage() {
  return (
    <div>
      <div>
        <SignForm />
      </div>
      <GithubLoginButton formAction={loginGithub} />
      <Link href="/sign/register">
      <RegisterButton/>
      </Link>
    </div>
  );
}
