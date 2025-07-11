import NextAuth from 'next-auth';

/**
 * Extend NextAuth types for custom user properties
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'user' | 'admin';
    };
  }
  
  interface User {
    id: string;
    role?: 'user' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: 'user' | 'admin';
  }
}