'use server';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
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
          label: 'Password',
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
});
