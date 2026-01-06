import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import { prisma } from './prisma';
import { comparePassword } from './validator';
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'user@mail.com' },
        passwd: {
          label: '비밀번호',
          type: 'password',
          placeholder: 'password...',
        },
      },
      async authorize(credentials) {
        console.log('🚀 ~ credentials:', credentials);
        const { email, passwd } = credentials;
        return {
          email: email as string,
          passwd: passwd as string,
        };
      },
    }),
    Github,
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, passwd, name: nickname } = user;
      let oldUser =
        email && (await prisma.user.findUnique({ where: { email } }));

      if (account?.provider === 'credentials') {
        if (!oldUser)
          throw makeAuthError(
            'EmailSignInError',
            '존재하지 않는 이메일입니다.',
          );

        if (
          passwd &&
          oldUser.passwd &&
          !(await comparePassword(passwd, oldUser.passwd))
        )
          throw makeAuthError('EmailSignInError', '로그인에 실패하셨습니다.');
      } else {
        if (!oldUser) {
          if (!email || !nickname)
            throw makeAuthError(
              'OAuthAccountNotLinked',
              '이메일 또는 비밀번호를 입력해주세요.',
            );

          oldUser = await prisma.user.create({
            data: { email, nickname },
          });
        }
      }

      user.id = String(oldUser.id);
      user.name = oldUser.nickname;
      user.isAdmin = oldUser.isAdmin;

      return true;
    },
    async jwt({ token, user, trigger }) {
      // console.log('🚀 jwt - token:', token);
      // console.log('🚀 jwt - user:', user);
      if (trigger) console.log('🚀 jwt - trigger:', trigger);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isadmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.isAdmin = user.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign',
    error: '/sign/error',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  jwt: { maxAge: 30 * 60 },
});

const makeAuthError = (type: AuthError['type'], message?: string) => {
  const err = new AuthError(message);
  err.type = type;
  return err;
};
