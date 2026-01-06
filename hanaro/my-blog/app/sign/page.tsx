import Link from 'next/link';
import { loginGithub } from '@/lib/sign.action';
import { GithubLoginButton } from './GithubLoginButton';
import { RegisterButton } from './RegisterButton';
import SignForm from './SignForm';

export default function SignInPage() {
  return (
    <div>
      <div>
        <SignForm />
      </div>
      <div className="grid grid-cols-2 place-items-center">
        <form className="flex gap-3">
          <input type="hidden" name="redirectTo" value={'/'} />
          <GithubLoginButton formAction={loginGithub} />
        </form>
        <Link href="/sign/register">
          <RegisterButton />
        </Link>
      </div>
    </div>
  );
}
