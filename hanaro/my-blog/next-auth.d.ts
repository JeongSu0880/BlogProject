import type { DefaultSession } from 'next-auth';

import type { JWT } from 'next-auth/jwt';

export type X = JWT;

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin?: boolean;
      nickname: string;
    } & DefaultSession['user'];
  }

  interface User {
    passwd?: string;
    isAdmin?: boolean;
    nickname: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean;
    nickname: string;
  }
}
